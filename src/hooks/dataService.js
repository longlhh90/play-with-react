import { useReducer, useCallback } from 'react';

const initialState = {
    loading: false,
    error: null,
    data: null,
    extra: null,
    identifier: null
};

const dataReducer = (curDataState, action) => {
    switch (action.type) {
        case 'SEND':
            return {
                loading: true,
                error: null,
                data: null,
                extra: null,
                identifier: action.identifier
            };
        case 'RESPONSE':
            return {
                ...curDataState,
                loading: false,
                data: action.responseData,
                extra: action.extra
            };
        case 'ERROR':
            return { loading: false, error: action.errorMessage };
        case 'CLEAR':
            return initialState;
        default:
            throw new Error('Something is wrong!');
    }
};

const useData = () => {
    const [dataState, dispatchData] = useReducer(dataReducer, initialState);

    const clear = useCallback(() => dispatchData({ type: 'CLEAR' }), []);

    const sendRequest = useCallback(
        (url, method, body, reqExtra, reqIdentifer) => {
            dispatchData({ type: 'SEND', identifier: reqIdentifer });
            fetch(url, {
                method: method,
                body: body,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    return response.json();
                })
                .then(responseData => {
                    dispatchData({
                        type: 'RESPONSE',
                        responseData: responseData,
                        extra: reqExtra
                    });
                })
                .catch(error => {
                    dispatchData({
                        type: 'ERROR',
                        errorMessage: error.message
                    });
                });
        },
        []
    );

    return {
        isLoading: dataState.loading,
        data: dataState.data,
        error: dataState.error,
        sendRequest: sendRequest,
        reqExtra: dataState.extra,
        reqIdentifer: dataState.identifier,
        clear: clear
    };
};

export default useData;
