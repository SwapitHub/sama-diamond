import { ADD_TO_COMPARE, REMOVE_FROM_COMPARE } from '../constants';

const compareData = (state = [], action) => {
    switch (action.type) {
        case ADD_TO_COMPARE:
            console.warn("ADD_TO_COMPARE condition ", action);
            return [...state, action.payload];
        case REMOVE_FROM_COMPARE:
            console.warn("REMOVE_FROM_COMPARE condition ", action);
            return state.filter(item => item.id !== action.payload.id);
        default:
            return state;
    }
};

export default compareData;
