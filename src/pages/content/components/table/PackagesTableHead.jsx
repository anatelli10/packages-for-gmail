import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const headCells = [
  {
    label: 'Sender',
    orderProperty: 'sender'
  },
  {
    label: 'Package Status',
    orderProperty: 'status'
  },
  {
    label: 'Delivery Time',
    orderProperty: 'deliveryTime'
  },
  {
    label: 'Message Time',
    orderProperty: 'messageDate'
  },
  {
    label: 'Tracking Number',
    orderProperty: 'courierCode',
    align: 'right'
  }
];

const useStyles = makeStyles(theme => ({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  }
}));

const PackagesTableHead = props => {
  const classes = useStyles();
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = property => event => onRequestSort(event, property);

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell, index) => (
          <TableCell
            key={headCell.orderProperty}
            align={headCell.align ?? 'left'}
            sortDirection={orderBy === headCell.orderProperty ? order : false}
            style={{ paddingLeft: !index && 0 }}
          >
            <TableSortLabel
              active={orderBy === headCell.orderProperty}
              direction={orderBy === headCell.orderProperty ? order : 'asc'}
              onClick={createSortHandler(headCell.orderProperty)}
            >
              {headCell.label}
              {orderBy === headCell.orderProperty ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default PackagesTableHead;
