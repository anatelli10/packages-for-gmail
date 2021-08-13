import { useChromeStorageLocal as useChromeState } from 'use-chrome-storage';
import { saveAs } from 'file-saver';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import PrintIcon from '@material-ui/icons/Print';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import PackagesTableToolbar from './table/PackagesTableToolbar';
import PackagesTable from './table/PackagesTable';
import packagesText from '../modules/packagesText';
import validCouriers from '../modules/validCouriers';
import { AMOUNT_OF_DAYS, API_URL } from '..';

const statuses = [
    ['Unavailable', '#666666', <HelpOutlineIcon fontSize="small" />],
    ['Label Created', '#008af1', <PrintIcon fontSize="small" />],
    ['In Transit', '#222222', <LocalShippingIcon fontSize="small" />],
    ['Out for Delivery', '#222222', <LocalShippingIcon fontSize="small" />],
    ['Delivery Attempted', '#222222', <LocalShippingIcon fontSize="small" />],
    ['Returned to Sender', '#e93555', <ErrorOutlineIcon fontSize="small" />],
    ['Exception', '#e93555', <ErrorOutlineIcon fontSize="small" />],
    ['Delivered', '#549e4e', <CheckCircleOutlineIcon fontSize="small" />]
].map(([label, color, icon]) => ({
    label,
    color,
    icon
}));

const initialFilters = {
    days: AMOUNT_OF_DAYS,
    // Don't include S10 in filtering
    couriers: new Array(validCouriers.length - 1).fill(false),
    statuses: new Array(statuses.length).fill(false)
};

const initialOrdering = {
    order: 'asc',
    orderBy: 'messageDate'
};

// Key value pairs of courier codes and validCouriers index ['fedex', 0]
const courierIndices = new Map(
    validCouriers.map((courier, i) => [courier.courier_code, i])
);

const useStyles = makeStyles(theme => ({
    toolbarContainer: {
        height: '50px'
    },
    scroll: {
        '&::-webkit-scrollbar': {
            width: '10px',
            height: '10px'
        },
        '&::-webkit-scrollbar-button': {
            width: 0,
            height: 0,
            display: 'none'
        },
        '&::-webkit-scrollbar-corner': {
            backgroundColor: 'transparent'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            '&::-webkit-box-shadow':
                'inset 1px 1px 0 rgb(0 0 0 / 10%), inset 0 -1px 0 rgb(0 0 0 / 7%)'
        },
        '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'rgba(0,0,0,0.4)',
            '&::-webkit-box-shadow': 'inset 1px 1px 1px rgba(0,0,0,0.25)'
        },
        '&::-webkit-scrollbar-thumb:active': {
            backgroundColor: 'rgba(0,0,0,0.5)',
            '&::-webkit-box-shadow': 'inset 1px 1px 3px rgba(0,0,0,0.35)'
        }
    }
}));

const Packages = props => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const user = props.user;

    const [packages, setPackages] = useChromeState(
        `${user}_packages`,
        props.packages ?? { array: [] }
    );

    const [filters, setFilters] = useState(props.filters ?? initialFilters);
    const [ordering, setOrdering] = useState(props.ordering ?? initialOrdering);
    const [isUpdating, setUpdating] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [selected, setSelected] = useState(new Set());
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);

    const isFilterActive =
        filters.days < AMOUNT_OF_DAYS ||
        filters.couriers.find(Boolean) ||
        filters.statuses.find(Boolean);

    const text = packagesText(selected.size);

    const signOut = () => {
        props.setSignedIn(false);
        chrome.storage.local.remove(`${user}_tokens`, () =>
            enqueueSnackbar('Signed out of packages', {
                variant: 'success'
            })
        );
    };

    const authorizedFetch = async (path, options, callback) => {
        chrome.storage.local.get(`${user}_tokens`, async result => {
            const { token, refreshToken } = result[`${user}_tokens`];
            if (!token || !refreshToken) throw 'Missing tokens';

            const res = await fetch(API_URL + path, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                ...options
            });
            const json = await res.json();
            if (res.ok) return callback(json);

            if (json.message !== 'Unauthorized') throw json.message;

            // Unauthorized, attempt to refresh the tokens
            const tokenRes = await fetch(API_URL + '/accounts/refresh-token', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refreshToken
                })
            });
            if (!tokenRes.ok) throw tokenRes;
            const tokenJson = await tokenRes.json();
            chrome.storage.local.set(
                {
                    [`${user}_tokens`]: {
                        token: tokenJson.jwtToken,
                        refreshToken: tokenJson.refreshToken
                    }
                },
                // Retry
                () => authorizedFetch(path, options, callback)
            );
        });
    };

    useEffect(() => {
        // Only update once an hour
        if (Date.now() - packages.updated < 60 * 60 * 1000)
            return setUpdating(false);

        setUpdating(true);

        authorizedFetch(`/accounts/packages?email=${user}`, {}, response => {
            setPackages({ array: response.packages, updated: Date.now() });
            setUpdating(false);
            enqueueSnackbar('Updated packages', {
                variant: 'success'
            });
        }).catch(err => {
            setUpdating(false);
            enqueueSnackbar(`Error updating packages: ${err.message}`, {
                variant: 'error',
                autoHideDuration: 5000
            });
            signOut();
        });
    }, []);

    let rows = packages.array;

    if (isFilterActive) {
        rows = rows.filter(
            row =>
                !filters.couriers[courierIndices.get(row.courierCode)] &&
                !filters.statuses[row.status] &&
                (Date.now() - row.messageDate) / 86400000 <= filters.days
        );
    }

    if (searchText) {
        rows = rows.filter(row =>
            [
                row.sender,
                statuses[row.status].label,
                row.trackingNumber
            ].find(val =>
                String(val)
                    .toLowerCase()
                    .includes(searchText.toLowerCase().trim())
            )
        );
    }

    const handleResetPackages = () => {
        enqueueSnackbar('Resetting packages, please wait...', {
            variant: 'info',
            autoHideDuration: 3000
        });
        setUpdating(true);
        authorizedFetch(
            `/accounts/reset-packages?email=${user}`,
            {},
            response => {
                setSelected(new Set());
                setPackages({
                    array: response.packages,
                    updated: Date.now()
                });
                enqueueSnackbar(`Successfully reset packages`, {
                    variant: 'success'
                });
                setUpdating(false);
            }
        ).catch(err => {
            enqueueSnackbar(`Error resetting package(s): ${err.message}`, {
                variant: 'error',
                autoHideDuration: 5000
            });
            setUpdating(false);
        });
    };

    const handleRestorePackages = () => {
        enqueueSnackbar('Restoring deleted packages, please wait...', {
            variant: 'info',
            autoHideDuration: 3000
        });
        setUpdating(true);
        authorizedFetch(
            `/accounts/restore-packages?email=${user}`,
            {},
            response => {
                setSelected(new Set());
                setPackages({ array: response.packages, updated: Date.now() });
                enqueueSnackbar(`Successfully restored deleted packages`, {
                    variant: 'success'
                });
                setUpdating(false);
            }
        ).catch(err => {
            enqueueSnackbar(`Error restoring package(s): ${err.message}`, {
                variant: 'error',
                autoHideDuration: 5000
            });
            setUpdating(false);
        });
    };

    const handleSignOut = () => {
        fetch(API_URL + '/accounts/revoke-token', {
            method: 'post',
            body: JSON.stringify({ token: props.refreshToken })
        })
            .then(() => signOut())
            .catch(err => {
                enqueueSnackbar(`Error signing out: ${err.message}`, {
                    variant: 'error',
                    autoHideDuration: 5000
                });
            });
    };

    const handleAddPackage = values => {
        const { courierCode, trackingNumber, sender, senderUrl } = values;
        authorizedFetch(
            `/accounts/add-package?email=${user}`,
            {},
            {
                method: 'post',
                body: JSON.stringify({
                    courierCode,
                    trackingNumber,
                    sender,
                    senderUrl
                })
            },
            response =>
                setPackages({
                    array: [...packages.array, response.package],
                    updated: packages.updated
                })
        ).catch(err => {
            enqueueSnackbar(`Error adding package: ${err.message}`, {
                variant: 'error',
                autoHideDuration: 5000
            });
        });
    };

    const handleResetFilters = () => {
        setFilters(initialFilters);
        chrome.storage.local.set({ filters: initialFilters });
        setRows(packages.array);
        setSearchText(searchText);
    };

    const handleClearSearch = () => {
        setSearchText('');
        setRows(packages.array);
        setFilters(filters);
    };

    const handleSearch = event => {
        setSearchText(event.target.value);
        if (page !== 0) setPage(0);
    };

    const handleDelete = () => {
        authorizedFetch(
            `/accounts/delete-packages?email=${user}`,
            {
                method: 'post',
                body: JSON.stringify([...selected])
            },
            () => {
                setSelected(new Set());
                setPackages({
                    array: packages.array.filter(
                        row => !selected.has(row.trackingNumber)
                    ),
                    updated: packages.updated
                });
                enqueueSnackbar(`Deleted ${text}`, {
                    variant: 'success'
                });
            }
        ).catch(err => {
            enqueueSnackbar(`Error deleting package(s): ${err.message}`, {
                variant: 'error',
                autoHideDuration: 5000
            });
        });
    };

    const formattedDate = timestamp =>
        (timestamp ? new Date(timestamp) : new Date()).toJSON().slice(0, 10);

    const handleSave = () => {
        if (!selected.size) return;
        const blob = new Blob(
            [
                [
                    [
                        'Tracking Number',
                        'Courier',
                        'Sender',
                        'Message Date',
                        'Delivery Date'
                    ],
                    ...packages.array
                        .filter(row => selected.has(row.trackingNumber))
                        .map(row =>
                            [
                                `#${row.trackingNumber}`,
                                row.courierCode.toUpperCase(),
                                row.sender,
                                formattedDate(row.messageDate),
                                row.deliveryTime
                                    ? formattedDate(row.deliveryTime)
                                    : 'Unavailable'
                            ].join(',')
                        )
                ].join('\n')
            ],
            {
                type: 'text/plain;charset=utf-8'
            }
        );
        saveAs(blob, `Packages-${formattedDate()}.csv`);
        enqueueSnackbar(`Downloaded ${text}`, {
            variant: 'success'
        });
        setSelected(new Set());
    };

    const handleSelectAllClick = event => {
        if (
            !event.target.checked ||
            event.target.getAttribute('data-indeterminate') === 'true'
        )
            setSelected(new Set());
        else setSelected(new Set(rows.map(row => row.trackingNumber)));
    };

    const handleChangePage = (event, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box display="flex" flexDirection="column" height="100%">
            {/* Toolbar */}
            <Box flex="0 1 auto" className={classes.toolbarContainer}>
                <PackagesTableToolbar
                    statuses={statuses}
                    selectAll={handleSelectAllClick}
                    rowCount={packages.array.length}
                    searchRowCount={rows.length}
                    selectedCount={selected.size}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    isFilterActive={isFilterActive}
                    filters={filters}
                    setFilters={setFilters}
                    searchText={searchText}
                    handleClearSearch={handleClearSearch}
                    handleSearch={handleSearch}
                    handleDelete={handleDelete}
                    handleSave={handleSave}
                    handleAddPackage={handleAddPackage}
                    handleRestorePackages={handleRestorePackages}
                    handleResetPackages={handleResetPackages}
                    handleSignOut={handleSignOut}
                />
                <Divider />
            </Box>

            {/* Scrolling table */}
            <Box className={classes.scroll} flex="1 1 auto" overflow="auto">
                <PackagesTable
                    rowCount={packages.array.length}
                    isFilterActive={isFilterActive}
                    isUpdating={isUpdating}
                    statuses={statuses}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rows={rows}
                    selected={selected}
                    setSelected={setSelected}
                    ordering={ordering}
                    setOrdering={setOrdering}
                    searchText={searchText}
                    handleResetFilters={handleResetFilters}
                    handleClearSearch={handleClearSearch}
                />
            </Box>
        </Box>
    );
};

export default Packages;
