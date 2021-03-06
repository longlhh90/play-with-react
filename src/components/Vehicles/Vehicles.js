import React, { useState, useReducer, useEffect, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Chart } from "react-google-charts";
import { resetVehicleForm, updateVehicleForm } from '../../store/actions/vehicleForm';
import classes from './Vehicles.module.css';

import useData from '../../hooks/dataService';

import Modal from '../UI/Modal/Modal';
import VehicleForm from '../VehicleForm/VehicleForm';
import Spinning from '../UI/Spinning/Spinning';
import VehicleTable from '../VehicleItems/VehicleItems';

import clsx from 'clsx';
import { FormControl, InputLabel, InputAdornment, IconButton, Input as MInput, Button as MButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const url = `${process.env.REACT_APP_SERVER_URL}/vehicles`

const vehicleReducer = (currentVehicles, action) => {
    switch (action.type) {
        case 'SET':
            return action.vehicles;
        case 'ADD':
            return [...currentVehicles, action.vehicle];
        case 'EDIT':
            return currentVehicles.map(v => (v._id === action.vehicle._id ? { ...v, ...action.vehicle } : v));
        case 'DELETE':
            return currentVehicles.filter(e => e._id !== action._id);
        case 'SEARCH':
            return action.vehicles.filter(e => e.make.toLowerCase().includes(action.query.toLowerCase()) || e.model.toLowerCase().includes(action.query.toLowerCase()) || e.year === parseInt(action.query));

        default:
            throw new Error('Action Type is wrong!');
    }
};

const Vehicles = () => {
    const [createCarClicked, setCreateCarClicked] = useState(false);
    const [edit_vehicle, setEditVehicle] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [Vehicles, dispatch] = useReducer(vehicleReducer, []);
    const {
        isLoading,
        error,
        data,
        sendRequest,
        reqExtra,
        reqIdentifer,
        clear
    } = useData();

    useEffect(() => {
        if (!isLoading && !error && reqIdentifer === 'REMOVE_VEHICLE') {
            dispatch({ type: 'DELETE', _id: reqExtra });
        } else if (!isLoading && !error && reqIdentifer === 'ADD_VEHICLE') {
            dispatch({
                type: 'ADD',
                vehicle: { _id: data._id, status: "live", ...reqExtra }
            });
        } else if (!isLoading && !error && reqIdentifer === 'EDIT_VEHICLE') {
            dispatch({
                type: 'EDIT',
                vehicle: reqExtra
            });
        } else if (!isLoading && !error && reqIdentifer === 'SEARCH_VEHICLE') {
            dispatch({
                type: 'SEARCH',
                vehicles: data,
                query: reqExtra
            });
        }
    }, [data, reqExtra, reqIdentifer, isLoading, error]);

    //Add a vehicle to database on server
    const addVehicleHandler = useCallback(vehicle => {
        sendRequest(
            `${url}`,
            'POST',
            JSON.stringify(vehicle),
            vehicle,
            'ADD_VEHICLE'
        );
        setCreateCarClicked(false);
    }, [sendRequest]);

    //Edit a vehicle in database on server
    const editVehicleHandler = useCallback((vehicleId, vehicle) => {
        sendRequest(
            `${url}/${vehicleId}`,
            'PUT',
            JSON.stringify(vehicle),
            { _id: vehicleId, ...vehicle },
            'EDIT_VEHICLE'
        );
        setCreateCarClicked(false);
    }, [sendRequest]);

    //Remove a vehicle from database on server
    const removeVehicleHandler = useCallback(
        vehicleId => {
            sendRequest(
                `${url}/${vehicleId}`,
                'DELETE',
                null,
                vehicleId,
                'REMOVE_VEHICLE'
            );
        },
        [sendRequest]
    );

    //Load vehicles from server
    useEffect(() => {
        const timer = setTimeout(() => {
            sendRequest(
                `${url}/`,
                'GET'
            );
        }, 500);
        return () => {
            clearTimeout(timer);
        };
    }, [sendRequest]);

    const filteredVehiclesHandler = useCallback(filteredVehicles => {
        dispatch({ type: 'SET', vehicles: filteredVehicles });
    }, []);

    const searchedVehiclesHandler = useCallback(q => {
        const timer = setTimeout(() => {
            sendRequest(
                `${url}`,
                'GET',
                null,
                q,
                'SEARCH_VEHICLE'
            );
        }, 500);
        return () => {
            clearTimeout(timer);
        };
    }, [sendRequest]);

    useEffect(() => {
        if (!isLoading && !error && data && reqIdentifer !== 'ADD_VEHICLE' && reqIdentifer !== 'REMOVE_VEHICLE' && reqIdentifer !== 'EDIT_VEHICLE' && reqIdentifer !== 'SEARCH_VEHICLE') {
            const loadedVehicles = [];
            for (const item of data) {
                loadedVehicles.push({
                    _id: item._id,
                    make: item.make,
                    model: item.model,
                    year: item.year,
                    price: item.price,
                    status: item.status
                });
            }
            filteredVehiclesHandler(loadedVehicles);
        }
    }, [data, isLoading, error, reqIdentifer, filteredVehiclesHandler]);


    const dispatchVehicleForm = useDispatch();

    const onEditVehicleButtonClicked = useCallback((vehicle) => {
        setEditVehicle(vehicle);
        setIsEdit(true);
        setCreateCarClicked(true);
        dispatchVehicleForm(updateVehicleForm(vehicle));
    }, [dispatchVehicleForm])

    const onCreateVehicleButtonClicked = () => {
        setEditVehicle(null);
        setIsEdit(false);
        setCreateCarClicked(true);
        dispatchVehicleForm(resetVehicleForm());
    }

    const onSearch = () => {
        const value_to_search = document.getElementById("searchbox").value;
        searchedVehiclesHandler(value_to_search);
    }

    const vehiclesList = useMemo(() => {
        return (
            <VehicleTable
                vehicleItems={Vehicles}
                onRemoveItem={removeVehicleHandler}
                onEditItem={onEditVehicleButtonClicked}
                loading={isLoading}
            />
        )
    }, [isLoading, Vehicles, removeVehicleHandler, onEditVehicleButtonClicked]);

    return (

        <div >
            <div className={classes.Chart}>
                <Chart
                    chartType="Bar"
                    loader={<Spinning isSmall={true} />}
                    data={[
                        ["Status", "Number"],
                        ["Sold", Vehicles.filter(e => e.status === 'sold').length],
                        ["Live", Vehicles.filter(e => e.status === 'live').length]
                    ]}
                    width="100%"
                    height="200px"
                    legendToggle
                    options={{
                        chartArea: { width: '50%' },
                        colors: ['#d81300'],
                    }}
                />
            </div>
            <Modal show={createCarClicked}
                bdClicked={() => setCreateCarClicked(false)}>
                <VehicleForm
                    isEdit={isEdit}
                    onAddVehicle={addVehicleHandler}
                    onEditVehicle={editVehicleHandler}
                    vehicle_to_edit={edit_vehicle}
                />
            </Modal>
            <MButton variant="contained" color="primary" onClick={onCreateVehicleButtonClicked}>Add New Vehicle</MButton>
            <div className={classes.Search}>
                <FormControl className={clsx({ width: '25ch' })}>
                    <InputLabel htmlFor="searchbox">Search</InputLabel>
                    <MInput
                        id="searchbox"
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="Search the vehicles on Make Model and Year"
                                    onClick={onSearch}
                                >
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
            </div>
            {error && <Modal show bdClicked={clear}>{error}</Modal>}
            {vehiclesList}
        </div>
    );
};

export default Vehicles;