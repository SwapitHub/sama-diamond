import { SET_CART_LIST } from '../constants';

const productDataCart = (state = [], action) => {
    switch (action.type) {
        case SET_CART_LIST:
            console.warn("product list cart condition ", action.payload);
            return action.payload;
        default:
            return state;
    }
};

export default productDataCart;
