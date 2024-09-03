import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from '../constants';

export const addToWishlist = (data) => {
    console.warn("Add to wishlist", data);
    return {
        type: ADD_TO_WISHLIST,
        payload: data
    };
};

export const removeToWishlist = (data) => {
    console.warn("action removeFromWishlist", data);
    return {
        type: REMOVE_FROM_WISHLIST,
        payload: data
    };
};
