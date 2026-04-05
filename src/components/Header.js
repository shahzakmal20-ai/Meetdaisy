import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const DEFAULT_LOGO = require('../../assets/daisylogo.png'); //  ADDED

// ADDED (new prop: isHome)
const Header = ({
  onSearchPress,
  onFilterPress,
  isHome = false,
  showSearchInput = false,
  searchText = '',
  setSearchText = () => {},
  onSubmitSearch = () => {},
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* HOME HEADER (UNCHANGED) */}
      {isHome && (
        <View style={styles.searchPill}>
          <TouchableOpacity
            style={styles.searchInputArea}
            onPress={onSearchPress}
          >
            <Icon
              name="search"
              size={20}
              color="#777"
              style={styles.searchIcon}
            />
            <Text style={styles.searchPlaceholder}>Find events...</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            onPress={onFilterPress}
            style={styles.filterIconArea}
          >
            <Icon name="options-outline" size={22} color="#020D1F" />
          </TouchableOpacity>
        </View>
      )}

      {/*  OTHER SCREENS HEADER */}
      {!isHome && !showSearchInput && (
        <View style={styles.defaultHeader}>
          <Image source={DEFAULT_LOGO} style={styles.logo} />
          <Text style={styles.title}>Daisy</Text>
        </View>
      )}

      {showSearchInput && (
        <View style={styles.searchHeader}>
          <Image source={DEFAULT_LOGO} style={styles.logo} />

          <View style={styles.searchBox}>
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search calendars..."
              placeholderTextColor="#999" 
              style={styles.searchInput}
            />

            <TouchableOpacity onPress={onSubmitSearch}>
              <Icon name="search" size={20} color="#22C3B5" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 10,
  },
  defaultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
    resizeMode: 'contain',
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#22C3B5',
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  searchInputArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#777',
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 25,
    backgroundColor: '#ddd',
    marginHorizontal: 10,
  },
  filterIconArea: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 10,
    height: 42,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },

  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 0,
    fontSize: 14,
    color: '#000',
  },
});
