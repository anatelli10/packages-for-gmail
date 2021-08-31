import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(theme => ({
    container: {
        margin: 'auto',
        width: '100%',
        minWidth: '200px',
        maxWidth: '300px'
    },
    paper: {
        marginLeft: '9px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '2px 4px',
        whiteSpace: 'nowrap'
    },
    icon: {
        fill: 'rgba(0, 0, 0, 0.54)',
        padding: '6px'
    },
    button: {
        padding: '6px'
    },
    root: {
        flex: 1,
        marginLeft: '8px'
    },
    input: {
        color: '#202124',
        fontSize: '16px',
        fontWeight: 'normal',
        fontFamily:
            "'Google Sans', Roboto, RobotoDraft, Helvetica, Arial, sans-serif",
        letterSpacing: 'initial'
    }
}));

const SearchInput = props => {
    const classes = useStyles();
    const {
        searchText,
        setSearchText,
        handleClearSearch,
        page,
        setPage
    } = props;

    const handleSearch = event => {
        setSearchText(event.target.value);
        if (page !== 0) setPage(0);
    };

    return (
        <div className={classes.container}>
            <Paper className={classes.paper}>
                <SearchIcon className={classes.icon} />
                <InputBase
                    placeholder="Search packages"
                    classes={{
                        root: classes.root,
                        input: classes.input
                    }}
                    inputProps={{
                        'aria-label': 'search packages',
                        value: searchText,
                        onChange: handleSearch
                    }}
                />
                {searchText && (
                    <Tooltip title="Clear search">
                        <IconButton
                            className={classes.button}
                            aria-label="clear search"
                            onClick={handleClearSearch}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Paper>
        </div>
    );
};

export default SearchInput;
