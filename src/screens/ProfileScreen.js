import React from 'react';
import Header from '../components/Header';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const menuData = [
  { id: 1, title: 'My Booked Events', icon: 'calendar-outline' },
  { id: 2, title: 'Saved Events', icon: 'bookmark-outline' },
  { id: 3, title: 'Event Reminders', icon: 'notifications-outline' },
  { id: 4, title: 'Interest Categories', icon: 'grid-outline' },
  { id: 5, title: 'Settings', icon: 'settings-outline' },
];

const ProfileScreen = () => {
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuLeft}>
          <Ionicons name={item.icon} size={22} color="#22C3B5" />
          <Text style={styles.menuText}>{item.title}</Text>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#aaa" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header />

      {/* PROFILE HEADER */}
      <View style={styles.profileCard}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=32' }}
          style={styles.avatar}
        />

        <Text style={styles.name}>Georgerina Hawks</Text>
        <Text style={styles.email}>Event Explorer</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}> Active Attendee</Text>
        </View>
      </View>

      {/* QUICK INFO */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Ionicons name="calendar" size={18} color="#22C3B5" />
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Events</Text>
        </View>

        <View style={styles.statBox}>
          <Ionicons name="bookmark" size={18} color="#22C3B5" />
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Saved</Text>
        </View>

        <View style={styles.statBox}>
          <Ionicons name="star" size={18} color="#22C3B5" />
          <Text style={styles.statNumber}>4.9</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      {/* MENU */}
      <FlatList
        data={menuData}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.menuContainer}
      />

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logoutBtn}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },

  profileCard: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
    margin: 15,
    borderRadius: 18,
    elevation: 3,
  },

  avatar: {
    width: 85,
    height: 85,
    borderRadius: 42,
    marginBottom: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  email: {
    fontSize: 13,
    color: '#777',
    marginTop: 3,
  },

  badge: {
    marginTop: 10,
    backgroundColor: '#e6f7f5',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },

  badgeText: {
    fontSize: 12,
    color: '#22C3B5',
    fontWeight: '600',
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 15,
    marginTop: 5,
  },

  statBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
  },

  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginTop: 4,
  },

  statLabel: {
    fontSize: 12,
    color: '#777',
  },

  menuContainer: {
    padding: 15,
  },

  menuItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },

  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },

  logoutBtn: {
    backgroundColor: '#ff4d4d',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoutText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
});