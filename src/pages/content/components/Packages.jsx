import { useChromeStorageLocal as useChromeState } from 'use-chrome-storage';
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
import authorizedFetch from '../modules/authorizedFetch';
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

    let rows = packages.array;
    const isFilterActive =
        filters.days < AMOUNT_OF_DAYS ||
        filters.couriers.find(Boolean) ||
        filters.statuses.find(Boolean);

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

    const handleSignOut = () => {
        chrome.storage.local.get(`${user}_tokens`, result => {
            const { refreshToken } = result[`${user}_tokens`];
            authorizedFetch(
                user,
                '/accounts/revoke-token',
                {
                    method: 'post',
                    body: JSON.stringify({ token: refreshToken })
                },
                () => {
                    props.setSignedIn(false);
                    chrome.storage.local.remove(`${user}_tokens`, () =>
                        enqueueSnackbar('Signed out of packages', {
                            variant: 'success'
                        })
                    );
                }
            ).catch(err => {
                enqueueSnackbar(`Error signing out: ${err.message}`, {
                    variant: 'error',
                    autoHideDuration: 5000
                });
            });
        });
    };

    const handleClearSearch = () => {
        setSearchText('');
        setFilters(filters);
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

    useEffect(() => {
        // Only update once an hour
        if (Date.now() - packages.updated < 60 * 60 * 1000)
            return setUpdating(false);

        setUpdating(true);

        authorizedFetch(
            user,
            `/accounts/packages?email=${user}`,
            {},
            response => {
                setPackages({ array: response.packages, updated: Date.now() });
                setUpdating(false);
                enqueueSnackbar('Updated packages', {
                    variant: 'success'
                });
            }
        ).catch(err => {
            setUpdating(false);
            enqueueSnackbar(`Error updating packages: ${err.message}`, {
                variant: 'error',
                autoHideDuration: 5000
            });
            handleSignOut();
        });
    }, []);

    return (
        <Box display="flex" flexDirection="column" height="100%">
            {/* Toolbar */}
            <Box flex="0 1 auto" className={classes.toolbarContainer}>
                <PackagesTableToolbar
                    user={user}
                    packages={packages}
                    setPackages={setPackages}
                    setUpdating={setUpdating}
                    statuses={statuses}
                    selectAll={handleSelectAllClick}
                    rowCount={packages.array.length}
                    searchRowCount={rows.length}
                    selected={selected}
                    setSelected={setSelected}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    isFilterActive={isFilterActive}
                    filters={filters}
                    setFilters={setFilters}
                    searchText={searchText}
                    setSearchText={setSearchText}
                    handleClearSearch={handleClearSearch}
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
                    setSearchText={setSearchText}
                    setFilters={setFilters}
                    handleClearSearch={handleClearSearch}
                />
            </Box>
        </Box>
    );
};

export default Packages;
