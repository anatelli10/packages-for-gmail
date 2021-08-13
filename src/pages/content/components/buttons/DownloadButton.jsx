import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import GetAppIcon from '@material-ui/icons/GetApp';
import SimpleDialog from '../table/SimpleDialog';
import packagesText from '../../modules/packagesText';

const DownloadButton = props => {
  const { selectedCount, handleSave } = props;
  const [open, setOpen] = useState(false);
  const text = packagesText(selectedCount);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  return (
    <React.Fragment>
      <Tooltip title="Download">
        <IconButton aria-label="download" onClick={handleClickOpen}>
          <GetAppIcon />
        </IconButton>
      </Tooltip>

      <SimpleDialog
        open={open}
        handleClose={handleClose}
        title={`Download ${text}`}
        description="The downloaded file can be opened in any software that supports .csv
            files such as Excel."
        confirmAction={handleSave}
      />
    </React.Fragment>
  );
};

export default DownloadButton;
