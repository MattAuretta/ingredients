import { useReducer, useCallback } from 'react';

const initialState = {
    loading: false,
    error: null,
    data: null,
    id: null,
    ingredient: null
}

const httpReducer = (httpState, action) => {
    switch (action.type) {
        case 'REQUEST':
            return { loading: true, error: null, data: null, id: null, ingredient: null };
        case 'RESPONSE':
            return { ...httpState, loading: false, data: action.responseData, id: action.id, ingredient: action.ingredient }; // Using the spread operator to merge in new changes to our state object
        case 'ERROR':
            return { loading: false, error: action.error };
        case 'RESET':
            return initialState;
        default:
            throw new Error(`Missing type in ingredientReducer: ${action.type}`);
    }
}

const useHttp = () => {
    const [httpState, httpDispatch] = useReducer(httpReducer, initialState);

    const resetError = useCallback(() => {
        httpDispatch({ type: 'RESET' });
    }, []);

    const sendRequest = useCallback((url, method, body, id, ingredient) => {
        httpDispatch({ type: 'REQUEST' });
        fetch(url, {
            method: method,
            body: body,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(responseData => {
                httpDispatch({
                    type: 'RESPONSE',
                    responseData: responseData,
                    id: id,
                    ingredient: ingredient
                });
            })
            .catch(error => {
                httpDispatch({
                    type: 'ERROR',
                    error: error.message
                });
            });
    }, []);

    return {
        data: httpState.data,
        error: httpState.error,
        id: httpState.id,
        ingredient: httpState.ingredient,
        loading: httpState.loading,
        resetError: resetError,
        sendRequest: sendRequest
    };
}

export default useHttp;