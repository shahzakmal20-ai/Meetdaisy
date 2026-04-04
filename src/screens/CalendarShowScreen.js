import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EventCard from '../components/EventCard';

const BASE_URL = 'https://ceola-unreprovable-modesto.ngrok-free.dev/api/v1/bigdaisy';

const CalendarShowScreen = ({ route }) => {
  const navigation = useNavigation();
  const { calendarSlug, calendarName, calendarLogo } = route.params;

  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchEvents = async (pageNum = 1) => {
    try {
      pageNum === 1 ? setLoading(true) : setLoadingMore(true);

      const url = `${BASE_URL}/calendar_events?calendar_slug=${calendarSlug}&page=${pageNum}&per_page=10`;
      const res = await fetch(url);
      const data = await res.json();

      const newEvents = data.events || [];

      if (pageNum === 1) {
        setEvents(newEvents);
      } else {
        setEvents(prev => [...prev, ...newEvents]);
      }

      setPage(pageNum);

      if (newEvents.length < 10) {
        setHasMore(false);
      }
    } catch (err) {
      console.log('CalendarShowScreen fetch error:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchEvents(1);
  }, []);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    fetchEvents(page + 1);
  };

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Image
        source={
          calendarLogo
            ? { uri: calendarLogo }
            : require('../../assets/daisylogo.png')
        }
        style={styles.logo}
      />
      <Text style={styles.headerTitle}>{calendarName}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#79beef" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={({ item }) => <EventCard item={item} />}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={1.2}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator size="small" color="#666" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Events Found</Text>
          </View>
        }
      />
    </View>
  );
};

export default CalendarShowScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyTitle: {
    fontSize: 16,
    color: '#777',
  },
});
