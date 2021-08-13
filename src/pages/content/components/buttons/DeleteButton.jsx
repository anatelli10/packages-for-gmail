import React, { useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SimpleDialog from '../table/SimpleDialog';
import packagesText from '../../modules/packagesText';

const DeleteButton = props => {
    const { selectedCount, handleDelete } = props;
    const [open, setOpen] = useState(false);
    const text = packagesText(selectedCount);

    const handleClickOpen = () => setOpen(true);

    const handleClose = () => setOpen(false);

    return (
        <React.Fragment>
            <Tooltip title="Delete">
                <IconButton aria-label="delete" onClick={handleClickOpen}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>

            <SimpleDialog
                open={open}
                handleClose={handleClose}
                title={`Delete ${text}?`}
                description={`${
                    selectedCount !== 1 ? 'These packages' : 'This package'
                } will be
            permanently deleted unless restored in the utilities menu. Are you
            sure?`}
                confirmAction={handleDelete}
            />
        </React.Fragment>
    );
};

export default DeleteButton;
