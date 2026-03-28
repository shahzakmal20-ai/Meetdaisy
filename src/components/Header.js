import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
    const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Logo */}
    <Image
      source={require('../../assets/daisylogo.png')}

      style={styles.logo}
    />

      <Text style={styles.appName}>MyDaisy</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#020D1F" />
        <TextInput
          placeholder="search events.."
          placeholderTextColor="#464343"
          style={styles.searchInput}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    elevation: 3, // Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#22C3B5', // white text for better contrast
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF', // lighter grey for search bar
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#22C3B5',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 5,
    marginLeft: 5,
    color: '#333', // text color
  },
  iconContainer: {
    padding: 5,
  },
});

export default Header;
