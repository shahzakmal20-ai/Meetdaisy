import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-native-calendars';
import {
  View,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const SearchModal = ({ visible, onClose, onApply, onClear, currentFilters }) => {
  const [name, setName] = useState(currentFilters?.name || '');
  const [location, setLocation] = useState(currentFilters?.location || '');
  const [priceType, setPriceType] = useState(currentFilters?.price_filter || 'any');
  const [dateFilter, setDateFilter] = useState(currentFilters?.date_filter || 'any');
  const [startDate, setStartDate] = useState(currentFilters?.start_date || '');
  const [endDate, setEndDate] = useState(currentFilters?.end_date || '');

  useEffect(() => {
    if (visible && currentFilters) {
      setName(currentFilters.name || '');
      setLocation(currentFilters.location || '');
      setPriceType(currentFilters.price_filter || 'any');
      setDateFilter(currentFilters.date_filter || 'any');
      setStartDate(currentFilters.start_date || '');
      setEndDate(currentFilters.end_date || '');
    }
  }, [visible, currentFilters]);

  const applyFilters = () => {
    onApply({
      name,
      location,
      price_filter: priceType,
      date_filter: dateFilter,
      start_date: startDate,
      end_date: endDate,
    });
    onClose();
  };

  const handleDayPress = (day) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString);
      setEndDate('');
    } else if (startDate && !endDate) {
      if (day.dateString < startDate) {
        setStartDate(day.dateString);
      } else {
        setEndDate(day.dateString);
      }
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
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

            <Text style={styles.filterLabel}>Price</Text>
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

            <Text style={styles.filterLabel}>Date</Text>
            <View style={styles.row}>
              {['any', 'today', 'custom'].map(type => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setDateFilter(type)}
                  style={[styles.btn, dateFilter === type && styles.activeBtn]}
                >
                  <Text
                    style={[
                      styles.btnText,
                      dateFilter === type && styles.activeText,
                    ]}
                  >
                    {type.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {dateFilter === 'custom' && (
              <View style={styles.calendarContainer}>
                <Text style={styles.dateRangeText}>
                  {startDate ? `Start: ${startDate}` : 'Select Start Date'}
                  {endDate ? `  |  End: ${endDate}` : ''}
                </Text>
                <Calendar
                  onDayPress={handleDayPress}
                  markedDates={{
                    ...(startDate ? { [startDate]: { selected: true, selectedColor: '#22C3B5' } } : {}),
                    ...(endDate ? { [endDate]: { selected: true, selectedColor: '#22C3B5' } } : {})
                  }}
                  theme={{
                    selectedDayBackgroundColor: '#22C3B5',
                    todayTextColor: '#22C3B5',
                    arrowColor: '#22C3B5',
                  }}
                />
              </View>
            )}

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionBtnClear}
                onPress={() => {
                  setName('');
                  setLocation('');
                  setPriceType('any');
                  setDateFilter('any');
                  setStartDate('');
                  setEndDate('');

                  if (onClear) {
                    onClear();
                  }
                  onClose();
                }}
              >
                <Text style={styles.actionTextClear}>Clear All</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtnApply} onPress={applyFilters}>
                <Text style={styles.actionTextApply}>Apply</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    maxHeight: '90%',
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
    color: '#000',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginTop: 10,
    marginBottom: 5,
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
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  actionBtnClear: {
    padding: 10,
  },
  actionTextClear: {
    color: '#ff4444',
    fontWeight: '600',
    fontSize: 16,
  },
  actionBtnApply: {
    backgroundColor: '#22C3B5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  actionTextApply: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    paddingBottom: 4,
    marginBottom: 2,
  },
  closeText: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
    paddingBottom: 2,
    marginBottom: 2,
  },
  calendarContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  dateRangeText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
});
