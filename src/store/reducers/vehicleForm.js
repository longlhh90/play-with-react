import { CHANGE_INPUT_VALUE, RESET_FORM_VALUE, UPDATE_FORM_VALUE } from '../actions/vehicleForm';
import { updateObject } from '../utils';


const initialState = {
    vehicleForm: {
        make: {
            elementType: 'input',
            label: 'Make:',
            elementConfig: {
                type: 'text'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        model: {
            elementType: 'input',
            label: 'Model:',
            elementConfig: {
                type: 'text'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        year: {
            elementType: 'input',
            label: 'Year:',
            elementConfig: {
                type: 'text'
            },
            value: '',
            validation: {
                required: true,
                isPositiveNumber: true,
            },
            valid: false,
            touched: false
        },
        price: {
            elementType: 'input',
            label: 'Price:',
            elementConfig: {
                type: 'text'
            },
            value: '',
            validation: {
                required: true,
                isPositiveFloatNumber: true,
            },
            valid: false,
            touched: false
        },
        status: {
            elementType: 'checkbox',
            label: 'Mark As Sold',
            elementConfig: {
                name: 'mark-as-sold',
                checked: false,
            },
            value: false,
            validation: {
            },
            valid: true,
            touched: false
        },
    },
    formIsValid: false
}

const checkValidity = (value, rules) => {
    let isValid = true;
    if (!rules) {
        return true;
    }

    if (rules.required) {
        isValid = value.trim() !== '' && isValid;
    }

    if (rules.isPositiveFloatNumber) {
        const pattern = /^\d+\.?\d*$/;
        isValid = pattern.test(value) && isValid
        // isValid = !isNaN(value) && !isNaN(parseFloat(value)) !== NaN && isValid
    }

    if (rules.isPositiveNumber) {
        const pattern = /^[0-9]*$/;
        isValid = pattern.test(value) && isValid
    }

    return isValid;
}

const inputChangedHandler = (state, event, inputIdentifier) => {
    const updatedFormElement = updateObject(state.vehicleForm[inputIdentifier], {
        value: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
        elementConfig: { ...state.vehicleForm[inputIdentifier].elementConfig, ...{ checked: event.target.type === 'checkbox' ? event.target.checked : null } },
        valid: checkValidity(event.target.value, state.vehicleForm[inputIdentifier].validation),
        touched: true
    })

    const updatedVehicleForm = updateObject(state.vehicleForm, { [inputIdentifier]: updatedFormElement });

    let formIsValid = true;
    for (let inputIdentifier in updatedVehicleForm) {
        formIsValid = updatedVehicleForm[inputIdentifier].valid && formIsValid;
    }

    return { vehicleForm: updatedVehicleForm, formIsValid: formIsValid };
}

const modifyInput = (state, action) => {
    const updatedState = inputChangedHandler(state, action.event, action.inputIdentifier);
    return updateObject(state, updatedState);
}

const clearInputs = (state) => {
    const updatedState = initialState;
    return updateObject(state, updatedState);
}

const updateInputs = (state, action) => {
    let updatedState = initialState
    for (let key in updatedState.vehicleForm) {
        updatedState = inputChangedHandler(
            updatedState,
            key === 'status'
                ? { target: { type: 'checkbox', checked: action.vehicle.status === 'live' ? false : true } }
                : { target: { type: 'text', value: action.vehicle[key].toString() } },
            key
        )
    }

    return updateObject(state, updatedState);
}

const vehicleFormReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_INPUT_VALUE: return modifyInput(state, action);
        case RESET_FORM_VALUE: return clearInputs(state);
        case UPDATE_FORM_VALUE: return updateInputs(state, action)
        default: return state;
    }
}

export default vehicleFormReducer;