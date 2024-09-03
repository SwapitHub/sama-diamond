import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_CART_COUNT, REMOVE_CART_COUNT } from '../constants';

export const addToCart = (data) => {
    console.warn("action is called", data);
    return {
        type: ADD_TO_CART,
        payload: data
    };
};

export const removeFromCart = (data) => {
    console.warn("action removeFromCart", data);
    return {
        type: REMOVE_FROM_CART,
        payload: data
    };
};

export const updateCartCount = (payload) => {
    return {
        type: UPDATE_CART_COUNT,
        payload
    };
};

export const removeCartCount = (payload) => {
    return {
        type: REMOVE_CART_COUNT,
        payload
    };
};
