export const CHANGE_INPUT_VALUE = 'CHANGE_INPUT_VALUE';
export const RESET_FORM_VALUE = 'RESET_FORM_VALUE';
export const UPDATE_FORM_VALUE = 'UPDATE_FORM_VALUE';

export const modifyInputCreatingCar = (event, inputName) => {
    return {
        type: CHANGE_INPUT_VALUE,
        inputIdentifier: inputName,
        event: event
    }
}

export const resetVehicleForm = () => {
    return {
        type: RESET_FORM_VALUE,
    }
}

export const updateVehicleForm = (vehicle) => {
    return {
        type: UPDATE_FORM_VALUE,
        vehicle: vehicle
    }
}