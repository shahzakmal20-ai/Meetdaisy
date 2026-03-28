import Icon from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Calendars from '../components/Calendars';
import Categories from '../components/Categories';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const API_URL =
    'https://ceola-unreprovable-modesto.ngrok-free.dev/api/v1/bigdaisy/events';

  // FETCH EVENTS
  const fetchEvents = async (pageNum = 1) => {
    try {
      pageNum === 1 ? setLoading(true) : setLoadingMore(true);

      const res = await fetch(`${API_URL}?page=${pageNum}&per_page=10`);

      const data = await res.json();

      const newEvents = data.events || [];

      if (pageNum === 1) {
        setEvents(newEvents);
      } else {
        setEvents(prev => [...prev, ...newEvents]);
      }

      setPage(pageNum);

      // stop when no more data
      if (newEvents.length < 10) {
        setHasMore(false);
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchEvents(1);
  }, []);

  //  LOAD MORE
  const loadMore = () => {
    if (loadingMore || !hasMore) return;

    fetchEvents(page + 1);
  };
  const openMap = location => {
    if (!location) return;

    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      location,
    )}`;
    Linking.openURL(url);
  };
  // CARD UI
  const BASE_URL = 'https://ceola-unreprovable-modesto.ngrok-free.dev';

  const openEvent = item => {
    if (!item.calendar_slug || !item.event_slug) return;

    const url = `${BASE_URL}/calendars/${item.calendar_slug}/events/${item.event_slug}`;

    Linking.openURL(url).catch(err => console.log('Error opening event:', err));
  };
  const renderItem = ({ item }) => {
    const date = item.start_date ? new Date(item.start_date) : null;

    const day = date ? date.getDate() : '--';
    const month = date
      ? date.toLocaleString('default', { month: 'short' })
      : '';

    return (
      <View style={styles.card}>
        {/* IMAGE */}
        <TouchableOpacity
          onPress={() => navigation.navigate('EventDetail', { event: item })}
        >
          <Image
            source={{
              uri: item.banner_image_url || 'https://via.placeholder.com/400',
            }}
            style={styles.image}
          />
        </TouchableOpacity>
        {/* DATE BADGE */}
        <View style={styles.dateBadge}>
          <Text style={styles.dateDay}>{day}</Text>
          <Text style={styles.dateMonth}>{month}</Text>
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.location}>{item.location || 'No location'}</Text>

          <Text style={styles.price}>
            $ {item.price ? `$${item.price}` : 'Free'}
          </Text>
        </View>
      </View>
    );
  };

  //  LOADING SCREEN
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#79beef" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <Categories />
      <Calendars />
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={1.2}
        removeClippedSubviews={true}
        initialNumToRender={10}
        windowSize={5}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No Events Found</Text>
              <Text style={styles.emptySubtitle}>
                Try again later or check your connection
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator size="small" color="#666" />
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f6f9',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#777',
    fontSize: 16,
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 14,
    marginTop: 14,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },

    elevation: 4,
  },

  image: {
    width: '100%',
    height: 250,
  },

  dateBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#111',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  dateDay: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  dateMonth: {
    color: '#fff',
    fontSize: 12,
  },

  content: {
    padding: 14,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },

  location: {
    marginTop: 6,
    color: '#666',
    fontSize: 13,
  },

  price: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },

  emptySubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});
