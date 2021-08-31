import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import PrintIcon from '@material-ui/icons/Print';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import packageStatuses from '../../modules/packageStatus';

const statusStyles = new Map(
    [
        ['Unavailable', '#666666', <HelpOutlineIcon fontSize="small" />],
        ['Label Created', '#008af1', <PrintIcon fontSize="small" />],
        ['In Transit', '#222222', <LocalShippingIcon fontSize="small" />],
        ['Out for Delivery', '#222222', <LocalShippingIcon fontSize="small" />],
        [
            'Delivery Attempted',
            '#222222',
            <LocalShippingIcon fontSize="small" />
        ],
        [
            'Returned to Sender',
            '#e93555',
            <ErrorOutlineIcon fontSize="small" />
        ],
        ['Exception', '#e93555', <ErrorOutlineIcon fontSize="small" />],
        ['Delivered', '#549e4e', <CheckCircleOutlineIcon fontSize="small" />]
    ].map(([label, color, icon], i) => [
        packageStatuses[i],
        {
            label,
            color,
            icon
        }
    ])
);

// const statusStyles = {
//     UNAVAILABLE: [
//         'Unavailable',
//         '#666666',
//         <HelpOutlineIcon fontSize="small" />
//     ],
//     LABEL_CREATED: ['Label Created', '#008af1', <PrintIcon fontSize="small" />],
//     IN_TRANSIT: [
//         'In Transit',
//         '#222222',
//         <LocalShippingIcon fontSize="small" />
//     ],
//     OUT_FOR_DELIVERY: [
//         'Out for Delivery',
//         '#222222',
//         <LocalShippingIcon fontSize="small" />
//     ],
//     DELIVERY_ATTEMPTED: [
//         'Delivery Attempted',
//         '#222222',
//         <LocalShippingIcon fontSize="small" />
//     ],
//     RETURNED_TO_SENDER: [
//         'Returned to Sender',
//         '#e93555',
//         <ErrorOutlineIcon fontSize="small" />
//     ],
//     EXCEPTION: ['Exception', '#e93555', <ErrorOutlineIcon fontSize="small" />],
//     DELIVERED: [
//         'Delivered',
//         '#549e4e',
//         <CheckCircleOutlineIcon fontSize="small" />
//     ]
// };

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
    const { status, label, searchableText } = props;
    const statusStyle = statusStyles.get(status);

    return (
        <Tooltip title={label ?? ''}>
            <Box
                className={classes.box}
                display="flex"
                alignItems="center"
                width="fit-content"
                style={{ color: statusStyle.color }}
            >
                <span className={classes.label}>
                    {searchableText
                        ? searchableText(statusStyle.label)
                        : statusStyle.label}
                </span>
                {statusStyle.icon}
            </Box>
        </Tooltip>
    );
};

export default Status;
