import React, { useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SimpleDialog from '../table/SimpleDialog';
import packagesText from '../../modules/packagesText';
import { useSnackbar } from 'notistack';
import authorizedFetch from '../../modules/authorizedFetch';

const DeleteButton = props => {
    const { enqueueSnackbar } = useSnackbar();
    const { user, packages, setPackages, selected, setSelected } = props;
    const [open, setOpen] = useState(false);

    const text = packagesText(selected.size);

    const handleDeletePackages = () => {
        authorizedFetch(
            user,
            `/accounts/delete-packages?email=${user}`,
            {
                method: 'post',
                body: JSON.stringify([...selected])
            },
            () => {
                setSelected(new Set());
                setPackages({
                    array: packages.array.filter(
                        row => !selected.has(row.trackingNumber)
                    ),
                    updated: packages.updated
                });
                enqueueSnackbar(`Deleted ${text}`, {
                    variant: 'success'
                });
            }
        ).catch(err => {
            enqueueSnackbar(`Error deleting package(s): ${err.message}`, {
                variant: 'error',
                autoHideDuration: 5000
            });
        });
    };

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
                    selected.size !== 1 ? 'These packages' : 'This package'
                } will be
            permanently deleted unless restored in the utilities menu. Are you
            sure?`}
                confirmAction={handleDeletePackages}
            />
        </React.Fragment>
    );
};

export default DeleteButton;
