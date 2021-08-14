import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import PackagesTableRow from './PackagesTableRow';
import PackagesTableHead from './PackagesTableHead';
import initialFilters from '../../modules/initialFilters';

const descendingComparator = (i, j, orderBy) => {
    let a = i[orderBy] ?? -1;
    let b = j[orderBy] ?? -1;
    if (typeof a === 'string') a = a.toLowerCase();
    if (typeof b === 'string') b = b.toLowerCase();
    if (b < a) return -1;
    if (b > a) return 1;
    if (orderBy === 'courierCode')
        return descendingComparator(i, j, 'trackingNumber');
    return 0;
};

const getComparator = (order, orderBy) => {
    let bool = order === 'desc';
    // Sort by relative time ago instead of milliseconds number (so reverse it)
    if (orderBy === 'deliveryTime' || orderBy === 'messageDate') bool = !bool;
    return bool
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
};

const useStyles = makeStyles(theme => ({
    root: {
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
    },
    button: {
        margin: theme.spacing(1)
    },
    label: {
        fontSize: '.875rem',
        color: '#616161',
        fontWeight: 500
    },
    emptyResults: {
        padding: '10rem 0 calc(10rem + 80px)',
        border: 'none',
        textAlign: 'center'
    }
}));

const PackagesTable = props => {
    const classes = useStyles();
    const {
        isFilterActive,
        isUpdating,
        ordering,
        packagesCount,
        page,
        rows,
        rowsPerPage,
        searchText,
        selected,
        handleClearSearch,
        setFilters,
        setOrdering,
        setSearchText,
        setSelected
    } = props;

    const handleResetFilters = () => {
        setFilters(initialFilters);
        chrome.storage.local.set({ filters: initialFilters });
        setSearchText(searchText);
    };

    const handleRequestSort = (event, property) => {
        const direction =
            ordering.orderBy === property && ordering.order === 'asc'
                ? 'desc'
                : 'asc';
        const updatedOrdering = { order: direction, orderBy: property };
        setOrdering(updatedOrdering);
        chrome.storage.local.set({ ordering: updatedOrdering });
    };

    const isSelected = key => selected.has(key);

    const handleClick = (event, key) => {
        if (isSelected(key)) selected.delete(key);
        else selected.add(key);
        setSelected(new Set(selected));
    };

    return (
        <TableContainer className={classes.root}>
            <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size={'medium'}
                aria-label="enhanced table"
            >
                <PackagesTableHead
                    order={ordering.order}
                    orderBy={ordering.orderBy}
                    onRequestSort={handleRequestSort}
                />

                <TableBody>
                    {!rows.length ? (
                        <TableRow>
                            <TableCell
                                className={classes.emptyResults}
                                colSpan={69}
                            >
                                {isUpdating && !searchText ? (
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        flexDirection="column"
                                    >
                                        <CircularProgress
                                            color="secondary"
                                            size={60}
                                            style={{ marginBottom: '20px' }}
                                        />
                                        <Typography
                                            className={classes.label}
                                            component="p"
                                            variant="h6"
                                        >
                                            Loading results...
                                        </Typography>
                                    </Box>
                                ) : (
                                    <React.Fragment>
                                        <Typography
                                            className={classes.label}
                                            component="p"
                                            variant="h6"
                                            style={{ paddingTop: '80px' }}
                                        >
                                            {/* I got bored, sorry future readers */}
                                            {`No results ${
                                                packagesCount > 0
                                                    ? `matching ${
                                                          searchText
                                                              ? `"${searchText}"${
                                                                    isFilterActive
                                                                        ? ` and `
                                                                        : ``
                                                                }`
                                                              : ``
                                                      }${
                                                          isFilterActive
                                                              ? `filter`
                                                              : ``
                                                      }.`
                                                    : `:(`
                                            }`}
                                        </Typography>
                                        {packagesCount > 0 && (
                                            <Box
                                                display="flex"
                                                justifyContent="center"
                                                alignItems="center"
                                            >
                                                {searchText && (
                                                    <Button
                                                        className={
                                                            classes.button
                                                        }
                                                        color="secondary"
                                                        onClick={
                                                            handleClearSearch
                                                        }
                                                    >
                                                        Clear Search
                                                    </Button>
                                                )}
                                                {isFilterActive && (
                                                    <Button
                                                        className={
                                                            classes.button
                                                        }
                                                        color="secondary"
                                                        onClick={
                                                            handleResetFilters
                                                        }
                                                    >
                                                        Reset Filters
                                                    </Button>
                                                )}
                                            </Box>
                                        )}
                                    </React.Fragment>
                                )}
                            </TableCell>
                        </TableRow>
                    ) : (
                        stableSort(
                            rows,
                            getComparator(ordering.order, ordering.orderBy)
                        )
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((row, index) => (
                                <PackagesTableRow
                                    key={row.trackingNumber}
                                    row={row}
                                    isSelected={isSelected}
                                    index={index}
                                    handleClick={handleClick}
                                    searchText={searchText.toLowerCase().trim()}
                                />
                            ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default PackagesTable;
