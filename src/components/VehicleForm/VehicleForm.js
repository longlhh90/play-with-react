import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { modifyInputCreatingCar, resetVehicleForm } from '../../store/actions/vehicleForm';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import Spinning from '../UI/Spinning/Spinning';
import classes from './VehicleForm.module.css'

const VehicleForm = (props) => {
    //load vehicle form with state from vehicle form reducer
    const vehicleFormState = useSelector(state => state.vehicleFormReducer);
    const dispatch = useDispatch();

    const formElementsArray = [];
    for (let key in vehicleFormState.vehicleForm) {
        if (key === 'status' && props.isEdit === true) {
            formElementsArray.push({
                id: key,
                config: vehicleFormState.vehicleForm[key]
            });
        } else if (key !== 'status') {
            formElementsArray.push({
                id: key,
                config: vehicleFormState.vehicleForm[key]
            });
        }
    }

    const submitHandler = event => {
        event.preventDefault();
        const vehicle = {
            make: vehicleFormState.vehicleForm.make.value,
            model: vehicleFormState.vehicleForm.model.value,
            year: parseInt(vehicleFormState.vehicleForm.year.value),
            price: parseFloat(vehicleFormState.vehicleForm.price.value),
        }
        if (props.isEdit) {
            vehicle.status = vehicleFormState.vehicleForm.status.value === true ? 'sold' : 'live'
            props.onEditVehicle(props.vehicle_to_edit.id, vehicle);
        } else {
            props.onAddVehicle(vehicle);
        }
        dispatch(resetVehicleForm());

    };

    let form = (
        <form onSubmit={submitHandler}>
            {formElementsArray.map((e) => (
                <Input
                    key={e.id}
                    elementType={e.config.elementType}
                    label={e.config.label}
                    elementConfig={e.config.elementConfig}
                    value={e.config.value}
                    invalid={!e.config.valid}
                    shouldValidate={e.config.validation}
                    touched={e.config.touched}
                    changed={(event) => dispatch(modifyInputCreatingCar(event, e.id))} />
            ))}

            <div className={classes.ButtonArea}>
                <Button disabled={!vehicleFormState.formIsValid}>{props.isEdit ? 'Edit' : 'Create'}</Button>
                {props.loading && <Spinning isSmall />}
            </div>

        </form>
    );

    return (
        <div className={classes.Form}>
            {form}
        </div>
    );
};

export default VehicleForm;