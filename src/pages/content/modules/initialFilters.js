import { AMOUNT_OF_DAYS } from '..';
import validCouriers from './validCouriers';
import statuses from './statuses';

const initialFilters = {
    days: AMOUNT_OF_DAYS,
    // Don't include S10 in filtering
    couriers: new Array(validCouriers.length - 1).fill(false),
    statuses: new Array(statuses.length).fill(false)
};

export default initialFilters;
