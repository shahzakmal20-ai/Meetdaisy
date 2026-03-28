import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Calendars = () => {
  const navigation = useNavigation();

  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCalendars();
  }, []);

  const fetchCalendars = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        'https://ceola-unreprovable-modesto.ngrok-free.dev/api/v1/bigdaisy/calendars',
      );

      const json = await res.json();

      const all = json?.calendars || [];

      // just take first 10 (no filter)
      setCalendars(all);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image
        source={
          item.logo_url ? { uri: item.logo_url } : require('../../assets/appicon.png')
        }
        style={styles.image}
      />
      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendars</Text>

        <TouchableOpacity onPress={() => navigation.navigate('AllCalendars')}>
          <Text style={styles.allBtn}>All</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        <FlatList
          data={calendars}
          horizontal
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
        />
      )}
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
