import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchModal = ({
  visible,
  onClose,
  onApply,
  onClear,
  currentFilters,
}) => {
  const [name, setName] = useState(currentFilters?.name || '');
  const [location, setLocation] = useState(currentFilters?.location || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    if (visible && currentFilters) {
      setName(currentFilters.name || '');
      setLocation(currentFilters.location || '');
    }
  }, [visible, currentFilters]);

  useEffect(() => {
    const delay = setTimeout(() => {
      console.log('Typing:', location);

      if (location && location.length > 2 && !isSelecting) {
        searchLocation(location);
      } else {
        setSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [location, isSelecting]);

  const searchLocation = async text => {
    if (!text || text.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&accept-language=en&q=${encodeURIComponent(
          text,
        )}`,
        {
          headers: {
            'User-Agent': 'MyReactNativeApp',
            Accept: 'application/json',
          },
        },
      );

      const data = await res.json();

      const formatted = data.map(item => {
        const parts = item.display_name.split(',');
        const city = parts[0]?.trim();
        const country = parts[parts.length - 1]?.trim();

        return {
          ...item,
          short_name: `${city}, ${country}`,
        };
      });

      setSuggestions(formatted);
    } catch (error) {
      console.log('API Error:', error);
    }
  };
  const applyFilters = () => {
    onApply({
      name,
      location,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Search</Text>
            <TouchableOpacity style={styles.topCloseBtn} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <Icon
                name="search-outline"
                size={20}
                color="#777"
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Search by name"
                placeholderTextColor="#888"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon
                name="location-outline"
                size={20}
                color="#777"
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Search by location"
                placeholderTextColor="#888"
                value={location}
                onChangeText={text => {
                  setLocation(text);

                  if (isSelecting) {
                    setIsSelecting(false);
                  }
                }}
                style={styles.input}
              />
            </View>
            {suggestions.length > 0 && (
              <View style={styles.suggestionsBox}>
                <ScrollView keyboardShouldPersistTaps="handled">
                  {suggestions.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.suggestionItem}
                      onPress={() => {
                        setLocation(item.short_name);
                        setSuggestions([]);
                        setIsSelecting(true);
                      }}
                    >
                      <View style={styles.suggestionRow}>
                        <Icon name="location-outline" size={18} color="#666" />
                        <Text style={styles.suggestionText}>
                          {item.short_name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionBtnClear}
                onPress={() => {
                  setName('');
                  setLocation('');

                  if (onClear) {
                    onClear();
                  }
                  onClose();
                }}
              >
                <Text style={styles.actionTextClear}>Clear All</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtnApply}
                onPress={applyFilters}
              >
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
    borderRadius: 20,
    padding: 20,
    maxHeight: '90%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 15,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    height: 55,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#333',
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  actionBtnClear: {
    padding: 10,
    flex: 1,
    alignItems: 'center',
  },
  actionTextClear: {
    color: '#ff4444',
    fontWeight: '700',
    fontSize: 16,
  },
  actionBtnApply: {
    backgroundColor: '#22C3B5',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    flex: 1.2,
    alignItems: 'center',
  },
  actionTextApply: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  topCloseBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
    padding: 5,
  },
  closeText: {
    fontSize: 24,
    color: '#ccc',
    fontWeight: '300',
  },
  suggestionsBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    maxHeight: 120, // smaller size
    marginTop: -10,
    marginBottom: 10,
    overflow: 'hidden',
  },

  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  suggestionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
});
