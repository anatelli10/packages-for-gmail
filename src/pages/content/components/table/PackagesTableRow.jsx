import React from 'react';
import { Img } from 'react-image';
import { fedex, ups, usps } from 'ts-tracking-number';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Status from './Status';
import CopyButton from '../buttons/CopyButton';

const urls = new Map([
    [fedex.courier_code, fedex.tracking_numbers[0].tracking_url],
    [ups.courier_code, ups.tracking_numbers[0].tracking_url],
    [usps.courier_code, usps.tracking_numbers[0].tracking_url]
]);

/**
 * Relative time snippet from stackoverflow, modified slightly
 * https://stackoverflow.com/a/53800501
 */
const units = {
    year: 24 * 60 * 60 * 1000 * 365,
    month: (24 * 60 * 60 * 1000 * 365) / 12,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000
};
const rtf = new Intl.RelativeTimeFormat('en');
const rtfDay = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
const getRelativeTime = (d1, d2 = new Date()) => {
    if (!d1) return 'Unavailable';

    const elapsed = d1 - d2;

    for (const u in units) {
        if (Math.abs(elapsed) > units[u] || u == 'second') {
            const value =
                elapsed < 0
                    ? Math.round(elapsed / units[u])
                    : // Always round up future times (used for delivery dates)
                      Math.ceil(elapsed / units[u]);

            // Yesterday, Today, Tomorrow, Now
            if ((u == 'day' && value >= -1 && value <= 1) || u == 'second') {
                const text = rtfDay.format(value, u);
                return text.charAt(0).toUpperCase() + text.slice(1);
            }

            // 'in 3 days' becomes 'in 3 days (Monday)'
            const appendage =
                u == 'day' && value >= 2
                    ? ` (${new Intl.DateTimeFormat('en-US', {
                          weekday: 'long'
                      }).format(d1)})`
                    : '';

            return rtf.format(value, u) + appendage;
        }
    }
};

const useStyles = makeStyles(theme => ({
    link: {
        display: 'block',
        width: 'fit-content',
        textDecoration: 'none',
        color: 'inherit',
        marginRight: 6
    },
    icon: {
        marginRight: 6
    },
    trackingNumber: {
        fontFamily: 'Consolas'
    },
    numberCell: {
        width: 0,
        padding: 0
    }
}));

const Icon = props => {
    return (
        <Img
            className={props.className}
            src={props.src}
            loader={
                <CircularProgress
                    className={props.className}
                    size="16px"
                    color="secondary"
                />
            }
            width="16px"
            height="16px"
        />
    );
};

const PackagesTableRow = props => {
    const classes = useStyles();
    const { row, index, isSelected, searchText } = props;
    const isItemSelected = isSelected(row.trackingNumber);
    const labelId = `enhanced-table-checkbox-${index}`;

    const searchableText = text => {
        if (!searchText) return text;
        const index = text.toLowerCase().indexOf(searchText);
        if (index === -1) return text;
        return (
            <span>
                {text.slice(0, index)}
                <mark>{text.slice(index, index + searchText.length)}</mark>
                {text.slice(index + searchText.length)}
            </span>
        );
    };

    return (
        <TableRow
            hover
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={row.trackingNumber}
            selected={isItemSelected}
        >
            {/* Selection check box */}
            <TableCell padding="checkbox">
                <Tooltip title="Select">
                    <Checkbox
                        onClick={event =>
                            props.handleClick(event, row.trackingNumber)
                        }
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                        color="default"
                    />
                </Tooltip>
            </TableCell>

            {/* Sender */}
            <TableCell align="left" style={{ paddingLeft: 0 }}>
                {/* TODO: tooltips persist and anchor to top left of window when clicking mail link sometimes */}
                <Tooltip title={row.messageId ? 'View message' : ''}>
                    <a
                        className={classes.link}
                        href={
                            row.messageId
                                ? window.location
                                      .toString()
                                      .replace(
                                          'packages',
                                          `inbox/${row.messageId}`
                                      )
                                : undefined
                        }
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            width="fit-content"
                        >
                            {row.senderUrl && (
                                <Icon
                                    className={classes.icon}
                                    src={[
                                        `https://${row.senderUrl}/favicon.ico`,
                                        `https://s2.googleusercontent.com/s2/favicons?domain=${row.senderUrl}`
                                    ]}
                                />
                            )}

                            {searchableText(row.sender)}
                        </Box>
                    </a>
                </Tooltip>
            </TableCell>

            {/* Package Status */}
            <TableCell align="left">
                <Status
                    status={row.status}
                    label={
                        row.status === 'UNAVAILABLE'
                            ? "This package hasn't been processed by the courier yet or something else went wrong trying to retrieve details for this package. If this package was detected in error then it will be automatically removed after 24 hours. You can expedite this process by manually deleting it."
                            : row.label
                    }
                    searchableText={searchableText}
                />
            </TableCell>

            {/* Delivery/Estimated Date */}
            <TableCell align="left">
                {row.deliveryDate
                    ? getRelativeTime(row.deliveryDate)
                    : 'Unavailable'}
            </TableCell>

            {/* Message Date */}
            <TableCell align="left">
                {getRelativeTime(row.messageDate)}
            </TableCell>

            {/* Tracking Number */}
            <TableCell align="right" className={classes.numberCell}>
                <Box
                    display="inline-flex"
                    alignItems="center"
                    width="fit-content"
                >
                    <Tooltip title="View courier site">
                        <a
                            className={classes.link}
                            href={urls
                                .get(row.courierCode)
                                ?.replace(/%s$/, row.trackingNumber)}
                        >
                            <Box
                                display="flex"
                                alignItems="center"
                                width="fit-content"
                            >
                                <Icon
                                    className={classes.icon}
                                    src={[
                                        chrome.runtime.getURL(
                                            `${row.courierCode}.png`
                                        )
                                    ]}
                                />
                                {searchableText(row.trackingNumber)}
                            </Box>
                        </a>
                    </Tooltip>
                    <CopyButton trackingNumber={row.trackingNumber} />
                </Box>
            </TableCell>
        </TableRow>
    );
};

export default PackagesTableRow;
