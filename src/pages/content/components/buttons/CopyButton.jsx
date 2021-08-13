import React from 'react';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Zoom from '@material-ui/core/Zoom';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(1),
    backgroundColor: '#549e4e',
    color: '#ffffff'
  },
  typography: {
    marginLeft: theme.spacing(0.5),
    fontSize: '.875rem'
  }
}));

const CopyButton = props => {
  const classes = useStyles();
  const { trackingNumber } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    navigator.clipboard.writeText(trackingNumber);
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setTimeout(() => {
      setAnchorEl(null);
    }, 1000);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'transitions-popper' : undefined;

  return (
    <React.Fragment>
      <Tooltip title="Copy">
        <IconButton aria-label="copy tracking number" onClick={handleClick}>
          <FileCopyIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement="left"
        transition
      >
        {({ TransitionProps }) => (
          <Zoom {...TransitionProps} timeout={150}>
            <Paper className={classes.paper}>
              <Box display="flex" alignItems="center">
                <CheckCircleIcon fontSize="small" />
                <Typography className={classes.typography}>Copied</Typography>
              </Box>
            </Paper>
          </Zoom>
        )}
      </Popper>
    </React.Fragment>
  );
};

export default CopyButton;
