import { combineReducers } from 'redux';
import cartData from './reducers/cartReducer';
import wishlistData from './reducers/wishlistReducer';
import productDataWishlist from './reducers/productReducer';
import productDataCart from './reducers/productReducerCart';
import compareData from './reducers/compareReducer';

const rootReducer = combineReducers({
  cartData,
  wishlistData,
  productDataWishlist,
  productDataCart,
  compareData,
});

export default rootReducer;
