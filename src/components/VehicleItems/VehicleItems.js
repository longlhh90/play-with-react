import React from 'react';
import Button from '../UI/Button/Button';
import classes from './VehicleItems.module.css';
import Spinning from '../UI/Spinning/Spinning';

const VehicleItems = (props) => {
    let vehicleItems = [];

    for (const item of props.vehicleItems) {
        vehicleItems.push({
            id: item._id,
            make: item.make,
            model: item.model,
            year: item.year,
            price: item.price,
            status: item.status,
        })
    }

    const listItem = vehicleItems.map((e, i) => {
        return (
            <tr key={e.id} className={classes.Item}>
                <td>{i + 1}</td>
                <td>{e.make}</td>
                <td>{e.model}</td>
                <td>{e.year}</td>
                <td>{e.price.toLocaleString('us-US', { style: 'currency', currency: 'USD' })}</td>
                <td>{e.status}</td>
                <td>
                    <Button icon="fa fa-edit" onclicked={props.onEditItem.bind(this, e)} />
                    <Button icon="fa fa-trash" onclicked={props.onRemoveItem.bind(this, e.id)} />
                </td>
            </tr>
        )
    })

    let vehicleTable

    if (props.loading) {
        vehicleTable = <Spinning />
    } else {
        vehicleTable =
            <div style={{ 'paddingTop': '15px' }}>
                <table>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Make</th>
                            <th>Model</th>
                            <th>Year</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listItem}
                    </tbody>
                </table>
            </div>
    }

    return (
        <React.Fragment>
            {vehicleTable}
        </React.Fragment>
    );
};

export default VehicleItems;