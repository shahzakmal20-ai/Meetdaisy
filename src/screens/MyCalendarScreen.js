import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../api/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import EventCard from '../components/EventCard';

const BASE_URL = 'https://ceola-unreprovable-modesto.ngrok-free.dev/api/v1/bigdaisy';
const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 200;

// ─── NOT LOGGED IN ────────────────────────────────────────────────────────────
const NotAuthenticatedView = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.centered}>
        <View style={styles.iconCircle}>
          <Icon name="calendar-outline" size={60} color="#22C3B5" />
          <View style={styles.lockBadge}>
            <Icon name="lock-closed" size={20} color="#fff" />
          </View>
        </View>
        <Text style={styles.title}>My Calendar</Text>
        <Text style={styles.subtitle}>
          Please login to see your personal calendar and saved events.
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>Login Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
const MyCalendarScreen = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigation = useNavigation();

  const [events, setEvents] = useState([]);
  const [calendarInfo, setCalendarInfo] = useState({
    name: 'My Calendar',
    logo_url: null,
    banner_image_url: null,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  const fetchEvents = useCallback(async (pageNum = 1, isRefresh = false) => {
    if (!user?.id) return;
    try {
      if (pageNum === 1 && !isRefresh) setLoading(true);
      if (pageNum > 1) setLoadingMore(true);

      const url = `${BASE_URL}/calendar_events?user_id=${user.id}&page=${pageNum}&per_page=10`;
      const res = await fetch(url);
      const data = await res.json();

      const newEvents = data.events || [];

      // Extract calendar info from data.calendar
      if (pageNum === 1) {
        const cal = data.calendar || {};
        setCalendarInfo({
          name: cal.name || 'My Calendar',
          logo_url: cal.logo_url || null,
          banner_image_url: cal.banner_image_url || null,
        });
        setEvents(newEvents);
      } else {
        setEvents(prev => [...prev, ...newEvents]);
      }

      setPage(pageNum);
      setHasMore(newEvents.length >= 10);
    } catch (err) {
      console.log('MyCalendarScreen fetch error:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isAuthenticated) fetchEvents(1);
  }, [isAuthenticated, fetchEvents]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    fetchEvents(page + 1);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    fetchEvents(1, true);
  };

  const handleLogout = () => {
    setMenuVisible(false);
    logout();
  };

  if (!isAuthenticated) return <NotAuthenticatedView />;

  // ── Banner + Logo + Name header ──
  const ListHeader = () => (
    <View style={styles.listHeaderContainer}>
      {/* Banner – from API, fallback to local asset */}
      <View style={styles.bannerWrapper}>
        <Image
          source={
            calendarInfo.banner_image_url
              ? { uri: calendarInfo.banner_image_url }
              : require('../../assets/default_banner_image.webp')
          }
          style={styles.bannerImage}
          resizeMode="cover"
        />

        {/* Logo centred on banner */}
        <View style={styles.logoWrapper}>
          <Image
            source={
              calendarInfo.logo_url
                ? { uri: calendarInfo.logo_url }
                : require('../../assets/daisylogo.png')
            }
            style={styles.calendarLogo}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Calendar name + subtitle below banner */}
      <View style={styles.calendarMeta}>
        <Text style={styles.calendarName}>{calendarInfo.name}</Text>
        <Text style={styles.calendarSubtitle}>Your personal events</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>My Calendar</Text>
          <TouchableOpacity style={styles.dotsBtn} onPress={() => setMenuVisible(true)}>
            <Icon name="ellipsis-vertical" size={22} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#22C3B5" />
          <Text style={styles.loadingText}>Loading your events…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>My Calendar</Text>
        <TouchableOpacity style={styles.dotsBtn} onPress={() => setMenuVisible(true)}>
          <Icon name="ellipsis-vertical" size={22} color="#333" />
        </TouchableOpacity>
      </View>

      {/* ── Events List ── */}
      <FlatList
        data={events}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <EventCard item={item} />}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#22C3B5" />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color="#22C3B5" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="calendar-clear-outline" size={70} color="#ccc" />
            <Text style={styles.emptyTitle}>No Events Found</Text>
            <Text style={styles.emptySubtitle}>
              You have no events linked to your account yet.
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => navigation.navigate('Explore')}
            >
              <Text style={styles.exploreButtonText}>Explore Events</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* ── 3-dot Menu Modal ── */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <Pressable style={styles.menuCard} onPress={() => {}}>
            {/* User Info */}
            <View style={styles.menuUserSection}>
              <View style={styles.menuAvatar}>
                <Text style={styles.menuAvatarText}>
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <View style={styles.menuUserInfo}>
                <Text style={styles.menuUserEmail} numberOfLines={1}>
                  {user?.email}
                </Text>
                <Text style={styles.menuUserRole}>
                  {user?.role || 'User'}
                </Text>
              </View>
            </View>

            <View style={styles.menuDivider} />

            {/* Logout */}
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Icon name="log-out-outline" size={20} color="#FF6B6B" />
              <Text style={styles.menuItemTextDanger}>Logout</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default MyCalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // ── Not-auth ──
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e7f9f7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  lockBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#22C3B5',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: '#22C3B5',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: '#22C3B5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  // ── Top bar ──
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  dotsBtn: {
    padding: 6,
  },

  // ── Loading ──
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#888',
  },

  // ── List header: banner + logo + meta ──
  listHeaderContainer: {
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  bannerWrapper: {
    width: width,
    height: BANNER_HEIGHT,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bannerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },


  logoWrapper: {
    position: 'absolute',
    bottom: -36,
    alignSelf: 'center',
    borderRadius: 44,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 8,
  },
  calendarLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e7f9f7',
  },
  calendarMeta: {
    alignItems: 'center',
    paddingTop: 48,  // space below logo (36 overlap + 12 gap)
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  calendarName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
    textAlign: 'center',
  },
  calendarSubtitle: {
    fontSize: 13,
    color: '#22C3B5',
    fontWeight: '500',
    marginTop: 4,
  },

  // ── List ──
  listContent: {
    paddingBottom: 30,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },

  // ── Empty ──
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#555',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  exploreButton: {
    marginTop: 24,
    borderWidth: 1.5,
    borderColor: '#22C3B5',
    paddingHorizontal: 28,
    paddingVertical: 11,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: '#22C3B5',
    fontSize: 14,
    fontWeight: '600',
  },

  // ── Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginTop: 70,
    marginRight: 16,
    width: 260,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  menuUserSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  menuAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#22C3B5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuAvatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  menuUserInfo: {
    flex: 1,
  },
  menuUserEmail: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  menuUserRole: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 12,
  },
  menuItemTextDanger: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF6B6B',
  },
});
