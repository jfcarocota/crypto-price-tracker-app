import React, { useEffect } from 'react';
import {View, Text, FlatList, Button, StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';
import { useAppDispatch, useAppSelector } from './src/hooks';
import { fetchCurrencies, selectCurrency, updatePrice } from './src/slices/currenciesSlice';
import {Provider} from "react-redux";
import store from "./src/store";
import CurrencyItem from "./src/components/CurrencyItem";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currencies, selectedCurrency, loading, error } = useAppSelector((state) => state.currencies);

  useEffect(() => {
    dispatch(fetchCurrencies());
  }, [dispatch]);

  const connectWebSocket = () => {
    const socket = new WebSocket('wss://ws-feed.pro.coinbase.com');
    socket.onopen = () => {
      socket.send(JSON.stringify({
        type: 'subscribe',
        product_ids: currencies.map(currency => `${currency.id}-USD`),
        channels: ['ticker']
      }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'ticker') {
        dispatch(updatePrice({ id: message.product_id.split('-')[0], price: message.price }));
      }
    };
  };

  const handleCurrencyPress = (id: string) => {
    dispatch(selectCurrency(id));
  };

  return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {loading && <Text>Loading...</Text>}
          {error && <Text>Error: {error}</Text>}
          <FlatList
              data={currencies}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                  <CurrencyItem
                      item={item}
                      selectedCurrency={selectedCurrency}
                      onPress={handleCurrencyPress}
                  />
              )}
          />
          <Button title="Connect to Price Feed" onPress={connectWebSocket} />
        </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

const ReduxApp = () => (
    <Provider store={store}>
      <App />
    </Provider>
);

export default ReduxApp;
