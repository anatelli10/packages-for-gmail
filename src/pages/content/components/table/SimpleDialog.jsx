import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const SimpleDialog = props => {
  const {
    open,
    handleClose,
    title,
    description,
    content,
    confirmAction
  } = props;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      maxWidth="xs"
    >
      <DialogTitle id="dialog-title">{title}</DialogTitle>
      <DialogContent>
        {description && (
          <DialogContentText id="dialog-description">
            {description}
          </DialogContentText>
        )}
        {content}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          {confirmAction ? 'Cancel' : 'Close'}
        </Button>
        {confirmAction && (
          <Button
            onClick={() => {
              confirmAction();
              handleClose();
            }}
            color="secondary"
            autoFocus
          >
            OK
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SimpleDialog;
