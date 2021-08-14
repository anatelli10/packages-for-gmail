import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';
import Toolbar from '@material-ui/core/Toolbar';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import AddButton from '../buttons/AddButton';
import DeleteButton from '../buttons/DeleteButton';
import DownloadButton from '../buttons/DownloadButton';
import UtilitiesButton from '../buttons/UtilitiesButton';
import FilterButton from '../buttons/FilterButton';
import SearchInput from './SearchInput';

const useStyles = makeStyles(theme => ({
    root: {
        height: '48px',
        padding: 0
    },
    toolbar: {
        padding: 0
    },
    checkbox: {
        padding: '0 0 0 4px'
    },
    selectedCountText: {
        whiteSpace: 'nowrap',
        padding: '0 9px'
    },
    pagination: {
        minWidth: 'fit-content'
    },
    caption: {
        color: '#5f6368',
        fontSize: '.75rem',
        letterSpacing: '.3px',
        textAlign: 'center',
        width: '80px' // fixed width so searching looks nicer
    },
    actions: {
        marginLeft: 0
    }
}));

const PackagesTableToolbar = props => {
    const {
        filters,
        isFilterActive,
        page,
        packages,
        packagesCount,
        rowsPerPage,
        searchRowCount,
        searchText,
        selected,
        user,
        handleChangePage,
        handleClearSearch,
        handleSignOut,
        selectAll,
        setFilters,
        setPackages,
        setSearchText,
        setSelected,
        setUpdating
    } = props;
    const classes = useStyles();
    const selectedCount = selected.size;
    return (
        <Toolbar className={classes.root} variant="dense">
            <div className={classes.checkbox}>
                <Tooltip title="Select">
                    <Checkbox
                        indeterminate={
                            selectedCount > 0 && selectedCount < packagesCount
                        }
                        checked={
                            packagesCount > 0 && selectedCount === packagesCount
                        }
                        onChange={selectAll}
                        inputProps={{ 'aria-label': 'select all packages' }}
                        color="default"
                    />
                </Tooltip>
            </div>
            {selectedCount > 0 ? (
                <Toolbar className={classes.toolbar} variant="dense">
                    <DownloadButton
                        packages={packages}
                        selected={selected}
                        setSelected={setSelected}
                    />
                    <DeleteButton
                        user={user}
                        packages={packages}
                        setPackages={setPackages}
                        selected={selected}
                        setSelected={setSelected}
                    />
                </Toolbar>
            ) : (
                <Toolbar className={classes.toolbar} variant="dense">
                    <AddButton
                        user={user}
                        packages={packages}
                        setPackages={setPackages}
                    />
                    <FilterButton
                        isFilterActive={isFilterActive}
                        filters={filters}
                        setFilters={setFilters}
                    />
                </Toolbar>
            )}
            <SearchInput
                searchText={searchText}
                setSearchText={setSearchText}
                handleClearSearch={handleClearSearch}
            />
            <TablePagination
                className={classes.pagination}
                rowsPerPageOptions={[]}
                component="div"
                count={searchRowCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                classes={{
                    caption: classes.caption,
                    actions: classes.actions
                }}
            />
            <UtilitiesButton
                user={user}
                setPackages={setPackages}
                setUpdating={setUpdating}
                setSelected={setSelected}
                handleSignOut={handleSignOut}
            />
        </Toolbar>
    );
};

export default PackagesTableToolbar;
