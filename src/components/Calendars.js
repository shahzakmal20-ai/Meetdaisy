import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Calendars = ({ calendars = [] }) => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('CalendarShow', {
          calendarSlug: item.slug,
          calendarName: item.name,
          calendarLogo: item.logo_url,
        })
      }
      style={styles.item}
    >
      <View style={styles.item}>
        <Image
          source={
            item.logo_url
              ? { uri: item.logo_url }
              : require('../../assets/daisylogo.png')
          }
          style={styles.image}
        />
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (!calendars || calendars.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Calendars</Text>

        <TouchableOpacity onPress={() => navigation.navigate('AllCalendars')}>
          <Text style={styles.allBtn}>All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={calendars}
        horizontal
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default Calendars;
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  allBtn: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
  },

  item: {
    alignItems: 'center',
    marginRight: 15,
    width: 70,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eee',
  },

  name: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});
