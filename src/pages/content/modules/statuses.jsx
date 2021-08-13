import React from 'react';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import PrintIcon from '@material-ui/icons/Print';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const statuses = [
    ['Unavailable', '#666666', <HelpOutlineIcon fontSize="small" />],
    ['Label Created', '#008af1', <PrintIcon fontSize="small" />],
    ['In Transit', '#222222', <LocalShippingIcon fontSize="small" />],
    ['Out for Delivery', '#222222', <LocalShippingIcon fontSize="small" />],
    ['Delivery Attempted', '#222222', <LocalShippingIcon fontSize="small" />],
    ['Returned to Sender', '#e93555', <ErrorOutlineIcon fontSize="small" />],
    ['Exception', '#e93555', <ErrorOutlineIcon fontSize="small" />],
    ['Delivered', '#549e4e', <CheckCircleOutlineIcon fontSize="small" />]
].map(([label, color, icon]) => ({
    label,
    color,
    icon
}));

export default statuses;
