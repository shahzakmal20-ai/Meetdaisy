import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

const AllCalendars = () => {
  const navigation = useNavigation();
  const [calendars, setCalendars] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchCalendars();
  }, []);

  const fetchCalendars = async (nextPage = 1) => {
    if (loading || loadingMore || !hasMore) return;

    nextPage === 1 ? setLoading(true) : setLoadingMore(true);

    try {
      const res = await fetch(
        `https://ceola-unreprovable-modesto.ngrok-free.dev/api/v1/bigdaisy/calendars?page=${nextPage}&per_page=10`,
      );

      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }

      const json = await res.json();

      const newData = json?.calendars || [];

      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setCalendars(prev =>
          nextPage === 1 ? newData : [...prev, ...newData],
        );

        setPage(nextPage);
      }
    } catch (err) {
      console.log('FETCH CALENDARS ERROR:', err);
      setHasMore(false); // Stop trying to load more on error
      if (nextPage === 1) setCalendars([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      fetchCalendars(page + 1);
    }
  };

  const renderItem = ({ item }) => {
    const openCalendar = item => {
      navigation.navigate('CalendarShow', {
        calendarSlug: item.slug,
        calendarName: item.name,
        calendarLogo: item.logo_url,
      });
    };

    const locationText = [item.city, item.state, item.country].filter(Boolean).join(', ');

    return (
      <TouchableOpacity onPress={() => openCalendar(item)} style={styles.card}>
        <Image
          source={
            item.logo_url
              ? { uri: item.logo_url }
              : require('../../assets/daisylogo.png')
          }
          style={styles.image}
        />

        <View style={styles.textContainer}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          {locationText ? (
            <Text style={styles.location}>{locationText}</Text>
          ) : (
            <Text style={styles.slug}>{item.slug}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#22C3B5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header showSearch={true} placeholder="Search calendars..." />
      <FlatList
        data={calendars}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#22C3B5" />
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default AllCalendars;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  listContent: {
    padding: 16,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    // Subtle shadow for premium feel
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },

  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },

  location: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },

  slug: {
    fontSize: 12,
    color: '#999',
    fontWeight: '400',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
