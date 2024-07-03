import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import currenciesReducer from './slices/currenciesSlice';

const store = configureStore({
  reducer: {
    currencies: currenciesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;