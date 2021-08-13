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
    statuses,
    selectAll,
    rowCount,
    searchRowCount,
    selectedCount,
    rowsPerPage,
    page,
    handleChangePage,
    handleChangeRowsPerPage,
    isFilterActive,
    filters,
    setFilters,
    searchText,
    handleClearSearch,
    handleSearch,
    handleDelete,
    handleSave,
    handleAddPackage,
    handleRestorePackages,
    handleResetPackages,
    handleSignOut
  } = props;
  const classes = useStyles();

  return (
    <Toolbar className={classes.root} variant="dense">
      <div className={classes.checkbox}>
        <Tooltip title="Select">
          <Checkbox
            indeterminate={selectedCount > 0 && selectedCount < rowCount}
            checked={rowCount > 0 && selectedCount === rowCount}
            onChange={selectAll}
            inputProps={{ 'aria-label': 'select all packages' }}
            color="default"
          />
        </Tooltip>
      </div>
      {selectedCount > 0 ? (
        <Toolbar className={classes.toolbar} variant="dense">
          <DownloadButton
            selectedCount={selectedCount}
            handleSave={handleSave}
          />
          <DeleteButton
            selectedCount={selectedCount}
            handleDelete={handleDelete}
          />
        </Toolbar>
      ) : (
        <Toolbar className={classes.toolbar} variant="dense">
          <AddButton handleAddPackage={handleAddPackage} />
          <FilterButton
            statuses={statuses}
            isFilterActive={isFilterActive}
            filters={filters}
            setFilters={setFilters}
          />
        </Toolbar>
      )}
      <SearchInput
        searchText={searchText}
        handleClearSearch={handleClearSearch}
        handleSearch={handleSearch}
      />
      <TablePagination
        className={classes.pagination}
        rowsPerPageOptions={[]}
        component="div"
        count={searchRowCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        classes={{
          caption: classes.caption,
          actions: classes.actions
        }}
      />
      <UtilitiesButton
        handleRestorePackages={handleRestorePackages}
        handleResetPackages={handleResetPackages}
        handleSignOut={handleSignOut}
      />
    </Toolbar>
  );
};

export default PackagesTableToolbar;
