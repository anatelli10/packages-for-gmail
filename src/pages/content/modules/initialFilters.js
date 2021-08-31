import { AMOUNT_OF_DAYS } from '..';
import packageStatuses from './packageStatus';
import validCouriers from './validCouriers';

const initialFilters = {
    // TODO: using AMOUNT_OF_DAYS reads as undefined ??? maybe something to do with webpack
    days: 90,
    // Don't include S10 in filtering
    couriers: new Array(validCouriers.length - 1).fill(false),
    statuses: new Array(packageStatuses.length).fill(false)
};

export default initialFilters;
