import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { useAuth } from '../api/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { DOMAIN_URL, getAuthHeader } from '../api/auth';

const EventCard = ({ item }) => {
  const navigation = useNavigation();
  const { isAuthenticated, token } = useAuth();

  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (item?.is_favorited) {
      setIsFavorite(true);
    }
  }, [item]);
  const onShare = async () => {
    try {
      await Share.share({
        message: `Check out this event: ${item.title}\n\nDate: ${new Date(
          item.start_date,
        ).toDateString()}\n\nLink: ${item.event_url || 'N/A'}`,
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleFavorite = async () => {
    // If not logged in → stop
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please login to save events', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Login',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      const API_URL = `${DOMAIN_URL}`;

      const response = await fetch(
        `${API_URL}/api/v1/events/${item.id}/favourites`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',

            Authorization: getAuthHeader(),
            'User-Token': `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        const newState = data.saved;

        setIsFavorite(newState);

        if (data.message) {
          Alert.alert('Success', data.message);
        }
      } else {
        Alert.alert('Error', data.message || 'Something went wrong');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Network error');
    } finally {
      setLoading(false);
    }
  };
  const dateText =
    item?.full_event_date_display ||
    new Date(item?.start_date).toDateString() ||
    'Date TBD';
  const priceText =
    item.price_type === 'free'
      ? 'Free'
      : item.price && item.price !== 0 && item.price !== '0'
      ? `$${item.price}`
      : null;

  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('EventDetail', { event: item })}
      >
        <View style={styles.imageContainer}>
          <Image
            source={
              item.banner_image_url
                ? { uri: item.banner_image_url }
                : require('../../assets/default_event_image.png')
            }
            style={styles.image}
          />
          {priceText && (
            <View style={styles.priceBadge}>
              <Text style={styles.priceBadgeText}>{priceText}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.dateRow}>
          <Text style={styles.dateText}>{dateText}</Text>
          <View style={styles.iconRow}>
            <TouchableOpacity
              onPress={handleFavorite}
              style={styles.iconButton}
              disabled={loading}
            >
              <Icon
                name={isFavorite ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={isFavorite ? '#afc93dff' : '#888'}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onShare} style={styles.iconButton}>
              <Icon name="share-social-outline" size={22} color="#888" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('EventDetail', { event: item })}
        >
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.detailsRow}>
            <Text style={styles.location}>
              {[item.city, item.state, item.country]
                .filter(Boolean)
                .join(', ') ||
                item.location ||
                'No location'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EventCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    width: '100%',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  imageContainer: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: 350,
    resizeMode: 'cover',
  },
  priceBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#22C3B5',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  priceBadgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '800',
  },
  content: {
    padding: 20,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 12,
  },
  dateText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
    lineHeight: 26,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  location: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
});
