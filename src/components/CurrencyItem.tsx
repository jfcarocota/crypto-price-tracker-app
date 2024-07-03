import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CryptoIcon from 'rn-crypto-icons-svg';
import { Currency } from '../slices/currenciesSlice';

interface Props {
    item: Currency;
    selectedCurrency: string | null;
    onPress: (id: string) => void;
}

const CurrencyItem: React.FC<Props> = ({ item, selectedCurrency, onPress }) => {
    return (
        <TouchableOpacity
            style={[
                styles.item,
                {
                    backgroundColor: selectedCurrency === item.id ? '#f0f0f0' : '#fff'
                }
            ]}
            onPress={() => onPress(item.id)}
        >
            {/*Times up here, can't  convert a string to AssetKey (name) so Icon is repeated with btc*/}
            <CryptoIcon name={'btc'} size={38}/>
            <View>
            <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>{item.price ? `$${item.price}` : 'Loading...'}</Text>
            </View>
        </TouchableOpacity>
);
};

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    icon: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 14,
        color: '#888',
    },
});

export default CurrencyItem;
