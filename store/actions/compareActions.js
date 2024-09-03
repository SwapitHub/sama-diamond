import { ADD_TO_COMPARE, REMOVE_FROM_COMPARE } from '../constants';

export const addToCompare = (data) => {
    console.warn("action is called", data);
    return {
        type: ADD_TO_COMPARE,
        payload: data
    };
};

export const removeFromCompare = (data) => {
    console.warn("action removeFromCompare", data);
    return {
        type: REMOVE_FROM_COMPARE,
        payload: data
    };
};
