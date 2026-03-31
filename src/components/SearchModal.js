import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const SearchModal = ({ visible, onClose, onApply, onClear, currentFilters }) => {
  const [name, setName] = useState(currentFilters?.name || '');
  const [location, setLocation] = useState(currentFilters?.location || '');
  const [priceType, setPriceType] = useState(currentFilters?.price_filter || 'any');

  useEffect(() => {
    if (visible && currentFilters) {
      setName(currentFilters.name || '');
      setLocation(currentFilters.location || '');
      setPriceType(currentFilters.price_filter || 'any');
    }
  }, [visible, currentFilters]);

  const applyFilters = () => {
    onApply({
      name,
      location,
      price_filter: priceType,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Search Filters</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Search by name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Search by location"
            placeholderTextColor="#888"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
          />

          <View style={styles.row}>
            {['any', 'free', 'paid'].map(type => (
              <TouchableOpacity
                key={type}
                onPress={() => setPriceType(type)}
                style={[styles.btn, priceType === type && styles.activeBtn]}
              >
                <Text
                  style={[
                    styles.btnText,
                    priceType === type && styles.activeText,
                  ]}
                >
                  {type.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => {
                setName('');
                setLocation('');
                setPriceType('any');

                if (onClear) {
                  onClear();
                }
                onClose();
              }}
            >
              <Text style={{ color: 'red' }}>Clear</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={applyFilters}>
              <Text style={{ color: '#22C3B5', fontWeight: 'bold' }}>
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    borderRadius: 6,
    padding: 10,
    color: '#000', // Explicit text color to prevent invisible white text in dark mode
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  btn: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#22C3B5',
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 3,
    alignItems: 'center',
  },
  activeBtn: {
    backgroundColor: '#22C3B5',
  },
  btnText: {
    color: '#22C3B5',
    fontWeight: '600',
  },
  activeText: {
    color: '#fff',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },

  closeText: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
});
