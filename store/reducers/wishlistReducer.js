import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from '../constants';

const wishlistData = (state = [], action) => {
    switch (action.type) {
        case ADD_TO_WISHLIST:
            console.warn("ADD_TO_WISHLIST condition ", action);
            return [{ ...action.payload }, ...state];
        case REMOVE_FROM_WISHLIST:
            console.warn("REMOVE_FROM_WISHLIST condition ", action);
            return state.filter(item => item.uniqueId !== action.payload.uniqueId);
        default:
            return state;
    }
};

export default wishlistData;
