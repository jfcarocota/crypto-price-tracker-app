import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { AppDispatch } from '../store';

export interface Currency {
  id: string;
  name: string;
  icon: string;
  price?: string;
}

interface CurrenciesState {
  currencies: Currency[];
  selectedCurrency: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: CurrenciesState = {
  currencies: [],
  selectedCurrency: null,
  loading: false,
  error: null,
};

const currenciesSlice = createSlice({
  name: 'currencies',
  initialState,
  reducers: {
    setCurrencies(state, action: PayloadAction<Currency[]>) {
      state.currencies = action.payload;
    },
    selectCurrency(state, action: PayloadAction<string>) {
      state.selectedCurrency = action.payload;
    },
    updatePrice(state, action: PayloadAction<{ id: string; price: string }>) {
      const currency = state.currencies.find(c => c.id === action.payload.id);
      if (currency) {
        currency.price = action.payload.price;
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setCurrencies, selectCurrency, updatePrice, setLoading, setError } = currenciesSlice.actions;

export const fetchCurrencies = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get('https://api.coinbase.com/v2/currencies');
    const currencyData = response.data.data.slice(0, 6).map((item: Currency) => ({
      id: item.id,
      name: item.name,
      icon: item.id.toLowerCase(),
    }));

    const prices = await Promise.all(currencyData.map(async (currency: {id: string}) => {
      const priceResponse = await axios.get(`https://api.coinbase.com/v2/prices/${currency.id}-USD/sell`);
      return { ...currency, price: priceResponse.data.data.amount };
    }));

    dispatch(setCurrencies(prices));
  } catch (error) {
    dispatch(setError('Failed to fetch currencies'));
  } finally {
    dispatch(setLoading(false));
  }
};

export default currenciesSlice.reducer;
