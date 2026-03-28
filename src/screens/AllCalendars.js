import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
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
      console.log(err);
    }

    setLoading(false);
    setLoadingMore(false);
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchCalendars(page + 1);
    }
  };

  const renderItem = ({ item }) => {
    const openCalendar = item => {
      navigation.navigate('CalendarShow', {
        calendarId: item.id,
        calendarName: item.name,
        slug: item.slug,
      });
    };
    return (
      <TouchableOpacity onPress={() => openCalendar(item)} style={styles.card}>
        <Image
          source={
            item.logo_url
              ? { uri: item.logo_url }
              : require('../../assets/appicon.png')
          }
          style={styles.image}
        />

        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.slug}>{item.slug}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={calendars}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? <ActivityIndicator size="small" color="#000" /> : null
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

  header: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: '#222',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
  },

  image: {
    width: 55,
    height: 55,
    borderRadius: 27,
    marginRight: 12,
    backgroundColor: '#e0e0e0',
  },

  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },

  slug: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
