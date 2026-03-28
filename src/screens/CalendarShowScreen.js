import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const CalendarShowScreen = ({ route }) => {
  const { calendarId, calendarName } = route.params;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = `https://ceola-unreprovable-modesto.ngrok-free.dev/api/v1/bigdaisy/calendars/${calendarId}/events`;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(API_URL);
      const json = await res.json();

      const data = json?.events || [];

      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>{item.date || item.start_date}</Text>
        <Text style={styles.location}>{item.location || 'No location'}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>{calendarName}</Text>

      {/* Loading */}
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.empty}>No events found</Text>
      )}
    </View>
  );
};

export default CalendarShowScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },

  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    color: '#222',
  },

  card: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },

  date: {
    marginTop: 5,
    color: '#555',
  },

  location: {
    marginTop: 3,
    color: '#777',
  },

  empty: {
    textAlign: 'center',
    marginTop: 30,
    color: '#999',
  },
});
