import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './rootReducer';
import productSaga from './sagas/productSaga';
import productSagaCart from './sagas/productSagaCart';

const persistConfig = {
  key: 'persist-store',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for redux-persist compatibility
    }).concat(sagaMiddleware),
});

export const persistor = persistStore(store);

sagaMiddleware.run(productSaga);
sagaMiddleware.run(productSagaCart);

export default store;
