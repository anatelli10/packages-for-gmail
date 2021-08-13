import { getTracking } from 'ts-tracking-number';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import validCouriers from '../../modules/validCouriers';

const useStyles = makeStyles(theme => ({
  textField: {
    margin: theme.spacing(1, 0)
  }
}));

const AddButton = props => {
  const classes = useStyles();
  const { handleAddPackage } = props;
  const [open, setOpen] = useState(false);
  const initialState = {
    trackingNumber: '',
    trackingNumberError: false,
    courierCode: null,
    sender: '',
    senderError: false,
    senderUrl: '',
    senderUrlError: false
  };
  const [values, setValues] = useState({ ...initialState });

  const handleChange = prop => event => {
    setValues({
      ...values,
      [prop]: event.target.value
    });
  };

  const validateTrackingNumber = event => {
    const tracking =
      event.target.value && getTracking(event.target.value, validCouriers);
    setValues({
      ...values,
      trackingNumberError: !tracking,
      courierCode: tracking
        ? tracking.courier.code === 's10'
          ? 'usps'
          : tracking.courier.code
        : null
    });
  };

  const validateSender = event =>
    setValues({ ...values, senderError: !Boolean(values.sender) });

  const validateSenderUrl = event => {
    const match = event.target.value.match(
      /(?:www\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4})/i
    );
    setValues({
      ...values,
      senderUrl: match ? match[1].toLowerCase() : event.target.value,
      senderUrlError: Boolean(event.target.value && !match)
    });
  };

  const handleClickOpen = () => {
    setValues({ ...initialState });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Tooltip title="Add package">
        <IconButton aria-label="refresh" onClick={handleClickOpen}>
          <AddIcon />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        maxWidth="xs"
      >
        <DialogTitle id="dialog-title">Add package</DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            Enter the details below to manually add a package.
          </DialogContentText>
          <Box display="flex" flexDirection="column">
            <TextField
              variant="outlined"
              required
              className={classes.textField}
              id="tracking-number-required"
              label="Tracking Number"
              color="secondary"
              value={values.trackingNumber}
              onBlur={validateTrackingNumber}
              onChange={handleChange('trackingNumber')}
              error={values.trackingNumberError}
              placeholder="9405511899535652238468"
              helperText={
                values.trackingNumberError ? 'Invalid tracking number' : ''
              }
              InputProps={{
                startAdornment: values.courierCode ? (
                  <InputAdornment position="start">
                    <img
                      src={chrome.runtime.getURL(`${values.courierCode}.png`)}
                      width="16px"
                      height="16px"
                    />
                  </InputAdornment>
                ) : undefined
              }}
            />
            <TextField
              variant="outlined"
              required
              className={classes.textField}
              id="sender"
              label="Sender"
              color="secondary"
              value={values.sender}
              onBlur={validateSender}
              onChange={handleChange('sender')}
              error={values.senderError}
              placeholder="eBay"
              helperText={values.senderError ? 'Invalid sender' : ''}
            />
            <TextField
              variant="outlined"
              className={classes.textField}
              id="sender-website"
              label="Sender website (optional)"
              color="secondary"
              value={values.senderUrl}
              onBlur={validateSenderUrl}
              onChange={handleChange('senderUrl')}
              error={values.senderUrlError}
              placeholder="ebay.com"
              helperText={
                values.senderUrlError
                  ? 'Invalid website'
                  : 'The website to display an icon from'
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            disabled={
              !values.trackingNumber ||
              !values.sender ||
              values.trackingNumberError ||
              values.senderUrlError
            }
            onClick={() => {
              handleAddPackage(values);
              handleClose();
            }}
            color="secondary"
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AddButton;
