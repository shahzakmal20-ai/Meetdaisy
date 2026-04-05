import Icon from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Calendars from '../components/Calendars';
import SearchModal from '../components/SearchModal';
import FilterModal from '../components/FilterModal';
import { useNavigation } from '@react-navigation/native';
import EventCard from '../components/EventCard';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Linking,
  ScrollView,
  Animated,
  RefreshControl,
} from 'react-native';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterInitialSection, setFilterInitialSection] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    location: '',
    price_filter: 'any',
    date_filter: 'any',
    start_date: '',
    end_date: '',
    category_ids: [],
  });
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [calendars, setCalendars] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const API_URL =
    'https://ceola-unreprovable-modesto.ngrok-free.dev/api/v1/bigdaisy/events';

  // FETCH EVENTS
  const fetchEvents = async (pageNum = 1, appliedFilters = filters) => {
    try {
      pageNum === 1 ? setLoading(true) : setLoadingMore(true);

      let url = `${API_URL}?page=${pageNum}&per_page=10`;

      if (appliedFilters.name?.trim()) {
        url += `&name=${encodeURIComponent(appliedFilters.name.trim())}`;
      }

      if (appliedFilters.location?.trim()) {
        url += `&location=${encodeURIComponent(
          appliedFilters.location.trim(),
        )}`;
      }
      if (
        appliedFilters.price_filter &&
        appliedFilters.price_filter !== 'any'
      ) {
        url += `&price_filter=${appliedFilters.price_filter}`;
      }

      if (appliedFilters.date_filter && appliedFilters.date_filter !== 'any') {
        url += `&date_filter=${appliedFilters.date_filter}`;
        if (appliedFilters.date_filter === 'custom') {
          if (appliedFilters.start_date)
            url += `&start_date=${appliedFilters.start_date}`;
          if (appliedFilters.end_date)
            url += `&end_date=${appliedFilters.end_date}`;
        }
      }

      if (
        appliedFilters.category_ids &&
        appliedFilters.category_ids.length > 0
      ) {
        url += `&category_ids=${appliedFilters.category_ids.join(',')}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }
      const data = await res.json();

      const newEvents = data.events || [];
      const newCategories = data.categories || [];
      const newCalendars = data.calendars || [];

      if (pageNum === 1) {
        setEvents(newEvents);
        if (newCategories.length > 0) {
          setCategories(newCategories);
        }
        if (newCalendars.length > 0) {
          setCalendars(newCalendars);
        }
      } else {
        setEvents(prev => [...prev, ...newEvents]);
      }

      setPage(pageNum);

      if (newEvents.length < 10) {
        setHasMore(false);
      }
    } catch (err) {
      console.log('FETCH EVENTS ERROR:', err);
      setHasMore(false); // Stop trying to load more on error
      if (pageNum === 1) setEvents([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchEvents(1);
  }, []);

  //  LOAD MORE
  const loadMore = () => {
    if (loading || loadingMore || !hasMore) return;

    fetchEvents(page + 1, filters);
  };

  const renderItem = ({ item }) => {
    return <EventCard item={item} />;
  };
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      setHasMore(true);
      setPage(1);
      await fetchEvents(1, filters);
    } finally {
      setRefreshing(false);
    }
  };

  const renderFilterBar = () => {
    const activeDate =
      filters.date_filter !== 'any'
        ? filters.date_filter === 'custom'
          ? 'Custom Date'
          : filters.date_filter.replace('_', ' ')
        : 'Date';
    const activePrice =
      filters.price_filter !== 'any' ? filters.price_filter : 'Price';
    const activeCategoriesCount = filters.category_ids.length;

    const filterHeight = scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [55, 0],
      extrapolate: 'clamp',
    });

    const filterOpacity = scrollY.interpolate({
      inputRange: [0, 80],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.filterBarContainer,
          { height: filterHeight, opacity: filterOpacity },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              filters.date_filter !== 'any' && styles.filterChipActive,
            ]}
            onPress={() => {
              setFilterInitialSection('date');
              setFilterModalVisible(true);
            }}
          >
            <Icon
              name="calendar-outline"
              size={16}
              color={filters.date_filter !== 'any' ? '#fff' : '#555'}
            />
            <Text
              style={[
                styles.filterChipText,
                filters.date_filter !== 'any' && styles.filterChipTextActive,
              ]}
            >
              {activeDate.charAt(0).toUpperCase() + activeDate.slice(1)}
            </Text>
            <Icon
              name="chevron-down"
              size={14}
              color={filters.date_filter !== 'any' ? '#fff' : '#888'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              filters.price_filter !== 'any' && styles.filterChipActive,
            ]}
            onPress={() => {
              setFilterInitialSection('price');
              setFilterModalVisible(true);
            }}
          >
            <Icon
              name="cash-outline"
              size={16}
              color={filters.price_filter !== 'any' ? '#fff' : '#555'}
            />
            <Text
              style={[
                styles.filterChipText,
                filters.price_filter !== 'any' && styles.filterChipTextActive,
              ]}
            >
              {activePrice.charAt(0).toUpperCase() + activePrice.slice(1)}
            </Text>
            <Icon
              name="chevron-down"
              size={14}
              color={filters.price_filter !== 'any' ? '#fff' : '#888'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              activeCategoriesCount > 0 && styles.filterChipActive,
            ]}
            onPress={() => {
              setFilterInitialSection('categories');
              setFilterModalVisible(true);
            }}
          >
            <Icon
              name="grid-outline"
              size={16}
              color={activeCategoriesCount > 0 ? '#fff' : '#555'}
            />
            <Text
              style={[
                styles.filterChipText,
                activeCategoriesCount > 0 && styles.filterChipTextActive,
              ]}
            >
              {activeCategoriesCount > 0
                ? `Categories (${activeCategoriesCount})`
                : 'Categories'}
            </Text>
            <Icon
              name="chevron-down"
              size={14}
              color={activeCategoriesCount > 0 ? '#fff' : '#888'}
            />
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
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
      <Header
        isHome={true}
        onSearchPress={() => setSearchModalVisible(true)}
        onFilterPress={() => setFilterModalVisible(true)}
      />
      {renderFilterBar()}
      <SearchModal
        visible={searchModalVisible}
        currentFilters={filters}
        onClose={() => setSearchModalVisible(false)}
        onApply={modalFilters => {
          const newFilters = { ...filters, ...modalFilters };
          setFilters(newFilters);
          setHasMore(true); // reset pagination
          fetchEvents(1, newFilters);
          // fetch filtered data
        }}
        onClear={() => {
          const resetFilters = {
            name: '',
            location: '',
            price_filter: 'any',
            date_filter: 'any',
            start_date: '',
            end_date: '',
            category_ids: [],
          };
          setFilters(resetFilters);
          setHasMore(true);
          fetchEvents(1, resetFilters);
        }}
      />
      <FilterModal
        visible={filterModalVisible}
        categories={categories}
        currentFilters={filters}
        initialSection={filterInitialSection}
        onClose={() => {
          setFilterModalVisible(false);
          setFilterInitialSection(null);
        }}
        onApply={modalFilters => {
          const newFilters = { ...filters, ...modalFilters };
          setFilters(newFilters);
          setHasMore(true);
          fetchEvents(1, newFilters);
        }}
        onClear={() => {
          const resetFilters = {
            ...filters,
            price_filter: 'any',
            date_filter: 'any',
            start_date: '',
            end_date: '',
            category_ids: [],
          };
          setFilters(resetFilters);
          setHasMore(true);
          fetchEvents(1, resetFilters);
        }}
      />
      <Animated.FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        removeClippedSubviews={true}
        initialNumToRender={10}
        windowSize={5}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        ListHeaderComponent={<Calendars calendars={calendars} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#22C3B5']}
          />
        }
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

  filterBarContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    overflow: 'hidden',
  },
  filterScroll: {
    paddingHorizontal: 15,
    gap: 10,
    alignItems: 'center',
    height: '100%',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#eee',
    gap: 6,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#22C3B5',
    borderColor: '#22C3B5',
  },
  filterChipText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#fff',
  },
});
