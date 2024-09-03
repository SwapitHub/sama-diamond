import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_CART_COUNT, REMOVE_CART_COUNT } from '../constants';

const cartData = (state = [], action) => {
    switch (action.type) {
        case ADD_TO_CART:
            return [{ ...action.payload, qty: 1 }, ...state];
        case REMOVE_FROM_CART:
            return state.filter(item => item.uniqueId !== action.payload.uniqueId);
        case UPDATE_CART_COUNT:
            return state.map(product =>
                product.id === action.payload.id
                    ? { ...product, qty: action.payload.qty }
                    : product
            );
        case REMOVE_CART_COUNT:
            return state.map(product =>
                product.id === action.payload.id
                    ? { ...product, qty: Math.max(action.payload.qty, 0) }
                    : product
            );
        default:
            return state;
    }
};

export default cartData;
