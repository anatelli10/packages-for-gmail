import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import GetAppIcon from '@material-ui/icons/GetApp';
import SimpleDialog from '../table/SimpleDialog';
import packagesText from '../../modules/packagesText';
import { useSnackbar } from 'notistack';
import { saveAs } from 'file-saver';

const DownloadButton = props => {
    const { enqueueSnackbar } = useSnackbar();
    const { packages, selected, setSelected } = props;
    const [open, setOpen] = useState(false);
    const text = packagesText(selected.size);

    const formattedDate = timestamp =>
        (timestamp ? new Date(timestamp) : new Date()).toJSON().slice(0, 10);

    const handleSave = () => {
        if (!selected.size) return;
        const blob = new Blob(
            [
                [
                    [
                        'Tracking Number',
                        'Courier',
                        'Sender',
                        'Message Date',
                        'Delivery Date'
                    ],
                    ...packages.array
                        .filter(row => selected.has(row.trackingNumber))
                        .map(row =>
                            [
                                `#${row.trackingNumber}`,
                                row.courierCode.toUpperCase(),
                                row.sender,
                                formattedDate(row.messageDate),
                                row.deliveryDate
                                    ? formattedDate(row.deliveryDate)
                                    : 'Unavailable'
                            ].join(',')
                        )
                ].join('\n')
            ],
            {
                type: 'text/plain;charset=utf-8'
            }
        );
        saveAs(blob, `Packages-${formattedDate()}.csv`);
        enqueueSnackbar(`Downloaded ${text}`, {
            variant: 'success'
        });
        setSelected(new Set());
    };

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
