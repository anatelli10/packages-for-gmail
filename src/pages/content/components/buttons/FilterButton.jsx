import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Popover from '@material-ui/core/Popover';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FilterListIcon from '@material-ui/icons/FilterList';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Status from '../table/Status';
import validCouriers from '../../modules/validCouriers';
import PackageStatus from '../../modules/PackageStatus';
import { AMOUNT_OF_DAYS } from '../..';

const useStyles = makeStyles(theme => ({
    formControl: {
        marginTop: '9px',
        minWidth: 120
    },
    icon: {
        marginRight: '6px'
    }
}));

const FilterButton = props => {
    const classes = useStyles();
    const isFilterActive = props.isFilterActive;

    const [days, setDays] = useState(props.filters.days);
    const [couriers, setCouriers] = useState([...props.filters.couriers]);
    const [statuses, setStatuses] = useState([...props.filters.statuses]);
    const [anchorEl, setAnchorEl] = useState(null);

    const popoverOpen = Boolean(anchorEl);
    const popoverId = popoverOpen ? 'simple-popover' : undefined;

    const handleCouriersChange = event => {
        const i = event.target.name;
        couriers[i] = !couriers[i];
        setCouriers([...couriers]);
    };

    const handleStatusesChange = event => {
        const i = parseInt(event.target.name);
        statuses[i] = !statuses[i];
        setStatuses([...statuses]);
    };

    const handleReset = () => {
        setDays(AMOUNT_OF_DAYS);
        setCouriers(new Array(couriers.length).fill(false));
        setStatuses(new Array(statuses.length).fill(false));
    };

    const handleSave = () => {
        handleClose();
        const filters = {
            days,
            couriers,
            statuses
        };
        props.setFilters(filters);
        chrome.storage.local.set({ filters });
    };

    const handleDaysChange = event => setDays(event.target.value);

    const handleClick = event => {
        setDays(props.filters.days);
        setCouriers([...props.filters.couriers]);
        setStatuses([...props.filters.statuses]);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    return (
        <React.Fragment>
            <Tooltip title="Filter">
                <IconButton aria-label="filter" onClick={handleClick}>
                    <FilterListIcon />
                    {!popoverOpen && isFilterActive && (
                        <Typography
                            color="primary"
                            style={{
                                width: '0',
                                position: 'relative',
                                top: '-5px',
                                left: '-3px'
                            }}
                        >
                            *
                        </Typography>
                    )}
                </IconButton>
            </Tooltip>

            <Popover
                id={popoverId}
                open={popoverOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                }}
                transitionDuration={{ enter: 150, exit: 0 }}
            >
                <DialogContent>
                    <Box display="inline-flex">
                        <div>
                            <FormLabel component="legend">Status</FormLabel>
                            <FormGroup>
                                {Object.keys(PackageStatus).flatMap((key, i) =>
                                    !isNaN(key)
                                        ? [
                                              <FormControlLabel
                                                  key={`status${i}`}
                                                  control={
                                                      <Checkbox
                                                          checked={!statuses[i]}
                                                          onChange={
                                                              handleStatusesChange
                                                          }
                                                          name={String(i)}
                                                      />
                                                  }
                                                  label={<Status index={i} />}
                                              />
                                          ]
                                        : []
                                )}
                            </FormGroup>
                        </div>
                        <div style={{ marginLeft: '20px' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <FormLabel component="legend">
                                    Courier
                                </FormLabel>
                                <FormGroup>
                                    {couriers.map((value, i) => (
                                        <FormControlLabel
                                            key={`courier${i}`}
                                            control={
                                                <Checkbox
                                                    checked={!couriers[i]}
                                                    onChange={
                                                        handleCouriersChange
                                                    }
                                                    name={String(i)}
                                                />
                                            }
                                            label={
                                                <React.Fragment>
                                                    <Box
                                                        display="flex"
                                                        alignItems="center"
                                                    >
                                                        <img
                                                            className={
                                                                classes.icon
                                                            }
                                                            src={chrome.runtime.getURL(
                                                                `${validCouriers[i].courier_code}.png`
                                                            )}
                                                            width="16px"
                                                            height="16px"
                                                        />
                                                        {validCouriers[i].name}
                                                    </Box>
                                                </React.Fragment>
                                            }
                                        />
                                    ))}
                                </FormGroup>
                            </div>
                            <div>
                                <FormLabel component="legend">
                                    Date within
                                </FormLabel>
                                <FormControl
                                    className={classes.formControl}
                                    variant="outlined"
                                >
                                    <InputLabel id="date-within"></InputLabel>
                                    <Select
                                        labelId="date-within"
                                        id="date-within-select"
                                        value={days}
                                        onChange={handleDaysChange}
                                        color="secondary"
                                    >
                                        <MenuItem value={1}>1 day</MenuItem>
                                        <MenuItem value={7}>1 week</MenuItem>
                                        <MenuItem value={14}>2 weeks</MenuItem>
                                        <MenuItem value={30}>1 month</MenuItem>
                                        <MenuItem value={60}>2 months</MenuItem>
                                        <MenuItem value={90}>3 months</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                    </Box>
                </DialogContent>
                <Box display="flex" justifyContent="space-between">
                    <DialogActions>
                        <Button onClick={handleReset} color="secondary">
                            Reset
                        </Button>
                    </DialogActions>
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} color="secondary">
                            OK
                        </Button>
                    </DialogActions>
                </Box>
            </Popover>
        </React.Fragment>
    );
};

export default FilterButton;
