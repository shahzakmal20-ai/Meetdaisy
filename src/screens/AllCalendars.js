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
  TextInput,
} from 'react-native';

const AllCalendars = () => {
  const navigation = useNavigation();
  const [calendars, setCalendars] = useState([]);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const [categories, setCategories] = useState([]); //  ADDED
  const [selectedCategories, setSelectedCategories] = useState([]); //  ADDED

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchCalendars();
  }, []);

  // ADDED (refetch when category changes)
  useEffect(() => {
    setHasMore(true);
    setPage(1);
    setCalendars([]);
    fetchCalendars(1, selectedCategories, appliedSearch);
  }, [selectedCategories, appliedSearch]);
  //  UPDATED (added categories filter param)
  const fetchCalendars = async (
    nextPage = 1,
    categoriesFilter = selectedCategories,
    search = appliedSearch,
  ) => {
    if (loading || loadingMore || (!hasMore && nextPage !== 1)) return;

    nextPage === 1 ? setLoading(true) : setLoadingMore(true);

    try {
      let url = `https://ceola-unreprovable-modesto.ngrok-free.dev/api/v1/calendars?page=${nextPage}&per_page=10`;

      // ADDED (category_ids in URL)
      if (categoriesFilter.length > 0) {
        url += `&category_ids=${categoriesFilter.join(',')}`;
      }
      if (search) {
        url += `&search=${search}`;
      } else if (categoriesFilter.length > 0 && appliedSearch) {
        url += `&search=${appliedSearch}`;
      }
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }

      const json = await res.json();

      const newData = json?.calendars || [];

      // ADDED (set categories from API)
      if (nextPage === 1 && json?.categories) {
        setCategories(json.categories);
      }

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
      setHasMore(false);
      if (nextPage === 1) setCalendars([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      fetchCalendars(page + 1, selectedCategories, appliedSearch);
    }
  };
  const onSearchSubmit = searchText => {
    setHasMore(true);
    setPage(1);
    setCalendars([]);
    fetchCalendars(1, selectedCategories, searchText);
  };
  //  ADDED (toggle multi-select)
  const toggleCategory = id => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  };

  // ADDED (render category item)
  const renderCategory = ({ item }) => {
    const isSelected = selectedCategories.includes(item.id);

    return (
      <TouchableOpacity
        onPress={() => toggleCategory(item.id)}
        style={[styles.categoryItem, isSelected && styles.categorySelected]}
      >
        <Text
          style={[
            styles.categoryText,
            isSelected && styles.categoryTextSelected,
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => {
    const openCalendar = item => {
      navigation.navigate('CalendarShow', {
        calendarSlug: item.slug,
        calendarName: item.name,
        calendarLogo: item.logo_url,
      });
    };

    const locationText = [item.city, item.state, item.country]
      .filter(Boolean)
      .join(', ');

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
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
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
      <Header
        showSearchInput={true}
        searchText={searchText}
        setSearchText={setSearchText}
        onSubmitSearch={() => {
          setAppliedSearch(searchText);
          onSearchSubmit(searchText);
        }}
      />
      {/* ADDED (Categories List) */}
      <FlatList
        data={categories}
        keyExtractor={item => item.id.toString()}
        renderItem={renderCategory}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryList}
      />

      <FlatList
        data={calendars}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No calendars found</Text>
            </View>
          )
        }
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },

  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },

  searchButton: {
    marginLeft: 10,
    backgroundColor: '#22C3B5',
    paddingHorizontal: 14,
    height: 40,
    justifyContent: 'center',
    borderRadius: 10,
  },

  searchButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  // ADDED (category styles)
  categoryList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 50,
  },

  categoryItem: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    height: 36, //  ADDED (fixed height)
    justifyContent: 'center', // ADDED
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    marginRight: 10,
  },

  categorySelected: {
    backgroundColor: '#22C3B5',
  },

  categoryText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  categoryTextSelected: {
    color: '#fff',
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
  emptyContainer: {
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '600',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
