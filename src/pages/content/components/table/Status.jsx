import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import statuses from '../../modules/statuses';

const useStyles = makeStyles(theme => ({
    box: {
        letterSpacing: '.25px',
        fontWeight: 500,
        fontSize: '.875rem',
        fontFamily:
            "'Google Sans', Roboto, RobotoDraft, Helvetica, Arial, sans-serif"
    },
    label: {
        marginRight: '2px'
    }
}));

const Status = props => {
    const classes = useStyles();
    const { index, label, searchableText } = props;
    const status = statuses[index];

    return (
        <Tooltip title={label ?? ''}>
            <Box
                className={classes.box}
                display="flex"
                alignItems="center"
                width="fit-content"
                style={{ color: status.color }}
            >
                <span className={classes.label}>
                    {searchableText
                        ? searchableText(status.label)
                        : status.label}
                </span>
                {status.icon}
            </Box>
        </Tooltip>
    );
};

export default Status;
