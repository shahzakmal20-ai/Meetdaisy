import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  Share,
  Alert,
  Linking,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import { useAuth } from '../api/AuthContext';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { DOMAIN_URL, getAuthHeader } from '../api/auth';

const { width } = Dimensions.get('window');

const EventDetailScreen = ({ route }) => {
  const { isAuthenticated, token } = useAuth();
  const navigation = useNavigation();
  const { event } = route.params;
  const [isSaved, setIsSaved] = useState(event?.is_favorited || false);
  const [loading, setLoading] = useState(false);

  const onShare = async () => {
    try {
      await Share.share({
        message: `Check out this event: ${event.title}\n\nDate: ${new Date(
          event.start_date,
        ).toDateString()}\n\nLink: ${event.event_url || 'N/A'}`,
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  const toggleFavorite = async () => {
    const API_URL = `${DOMAIN_URL}`;

    // BLOCK IF NOT LOGGED IN
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

    const previous = isSaved;
    setIsSaved(!previous); // optimistic UI
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/v1/events/${event.id}/favourites`,
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
        setIsSaved(data.saved);

        if (data.message) {
           ToastAndroid.show(data.message, ToastAndroid.SHORT);
        }
      } else {
        setIsSaved(previous); // rollback
        Alert.alert('Error', data.message || 'Something went wrong');
      }
    } catch (error) {
      setIsSaved(previous);
      Alert.alert('Error', 'Network error');
    } finally {
      setLoading(false);
    }
  };
  const copyToClipboard = () => {
    if (event?.location) {
      Clipboard.setString(event.location);
      Alert.alert('Success', 'Location copied to clipboard');
    }
  };

  const openMap = (location, lat, lng) => {
    let url = '';
    if (lat && lng) {
      url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    } else if (location) {
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        location,
      )}`;
    }

    if (url) {
      Linking.openURL(url);
    }
  };

  const getLeafletHTML = (lat, lng, locationName) => {
    const hasCoords = lat && lng;
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { height: 100vh; width: 100vw; }
          .error-container { 
            height: 100vh; display: flex; align-items: center; justify-content: center; 
            background: #f8f9fa; color: #666; font-family: sans-serif; text-align: center; padding: 20px;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const hasCoords = ${!!hasCoords};
          const lat = ${lat || 0};
          const lng = ${lng || 0};
          const locationName = "${locationName || ''}";

          const map = L.map('map', { zoomControl: true }).setView([lat, lng], 13);
          L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);

          if (hasCoords) {
            L.marker([lat, lng]).addTo(map);
          } else if (locationName) {
            fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(locationName))
              .then(response => response.json())
              .then(data => {
                if (data.length > 0) {
                  const result = data[0];
                  map.setView([result.lat, result.lon], 13);
                  L.marker([result.lat, result.lon]).addTo(map);
                } else {
                  showError();
                }
              })
              .catch(() => showError());
          } else {
            showError();
          }

          function showError() {
            document.getElementById('map').innerHTML = '<div class="error-container">Map Unavailable<br/><small>No location data found</small></div>';
          }
        </script>
      </body>
      </html>
    `;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* IMAGE HEADER */}
      <Image
        source={
          event?.banner_image_url
            ? { uri: event.banner_image_url }
            : require('../../assets/default_event_image.png')
        }
        style={styles.image}
      />

      {/* EXPLORE CALENDAR SLUG */}
      {event?.calendar_slug && (
        <TouchableOpacity
          style={styles.exploreLink}
          onPress={() =>
            navigation.navigate('CalendarShow', {
              calendarSlug: event.calendar_slug,
            })
          }
        >
          <View style={styles.exploreContent}>
            <Icon name="planet-outline" size={20} color="#22C3B5" />
            <Text style={styles.exploreText}>
              Explore{' '}
              <Text style={styles.slugHighlight}>@{event.calendar_slug}</Text>
            </Text>
          </View>
          <Icon name="chevron-forward" size={16} color="#ccc" />
        </TouchableOpacity>
      )}

      {/* CONTENT CARD */}
      <View style={styles.content}>
        {/* TITLE */}
        <Text style={styles.title}>{event?.title}</Text>

        {/* DATE & TIME */}
        <View style={styles.timeSection}>
          <View style={styles.dateTimeRow}>
            <Icon name="calendar-clear-outline" size={18} color="#222" />
            <Text style={styles.dateLabel}>
              {event?.full_event_date_display || 'No Date Available'}
            </Text>
          </View>
        </View>

        {/* LEARN MORE LINK */}
        {event?.event_url && (
          <TouchableOpacity
            style={styles.learnMoreLink}
            onPress={() => Linking.openURL(event.event_url)}
          >
            <Icon name="link-outline" size={16} color="#666" />
            <Text style={styles.learnMoreText}>Learn more</Text>
          </TouchableOpacity>
        )}

        {/* PRICE & ACTIONS (SHARE/SAVE) */}
        <View style={styles.priceContainer}>
          {event?.price_type === 'free' ? (
            <View style={styles.priceBox}>
              <Text style={styles.priceText}>Free Event</Text>
            </View>
          ) : event?.price && event?.price !== 0 && event?.price !== '0' ? (
            <View style={styles.priceBox}>
              <Text style={styles.priceText}>{`$${event.price}`}</Text>
            </View>
          ) : (
            <View />
          )}

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onShare}
              activeOpacity={0.7}
            >
              <Icon name="share-outline" size={22} color="#007bff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={toggleFavorite}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Icon
                name={isSaved ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={isSaved ? '#22C3B5' : '#555'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* LOCATION SECTION */}
        <Text style={styles.sectionTitle}>Event Location</Text>
        <View style={styles.locationContainer}>
          <TouchableOpacity
            style={styles.locationBox}
            onPress={() =>
              openMap(event?.location, event?.latitude, event?.longitude)
            }
          >
            <Icon name="location-outline" size={20} color="#222" />
            <Text style={styles.locationText} numberOfLines={1}>
              {event?.location || 'No location provided'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.copyButton}
            onPress={copyToClipboard}
            activeOpacity={0.7}
          >
            <Icon name="copy-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.mapContainer}>
          <WebView
            originWhitelist={['*']}
            source={{
              html: getLeafletHTML(
                event?.latitude,
                event?.longitude,
                event?.city || event?.location,
              ),
            }}
            style={styles.map}
            scrollEnabled={false}
          />
        </View>

        {/* ABOUT SECTION */}
        <Text style={styles.sectionTitle}>About Event</Text>
        <Text style={styles.description}>
          {event?.description ||
            'No description available for this event. Stay tuned for more details.'}
        </Text>

        {/* BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL('https://www.meetdaisy.co')}
        >
          <Text style={styles.buttonText}>Go to Daisy for explore more</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EventDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },

  image: {
    width: '100%',
    height: 260,
  },

  content: {
    backgroundColor: '#fff',
    marginTop: -20,

    padding: 18,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#222',
  },

  date: {
    marginTop: 6,
    color: '#666',
    fontSize: 13,
  },

  timeSection: {
    marginTop: 20,
    gap: 10,
  },

  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  dateLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },

  clockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  timeText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '600',
  },

  exploreLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 12,
  },

  exploreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  exploreText: {
    fontSize: 15,
    color: '#444',
    fontWeight: '500',
  },

  slugHighlight: {
    color: '#22C3B5',
    fontWeight: '800',
  },

  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  locationText: {
    marginLeft: 2,
    color: '#222',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
    flex: 1,
  },

  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
  },

  copyButton: {
    padding: 8,
    marginRight: 20,
    paddingRight: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },

  learnMoreLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    alignSelf: 'flex-start',
  },

  learnMoreText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  priceBox: {
    marginTop: 20,
    backgroundColor: '#e8f9f1',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },

  priceText: {
    color: '#1aa37a',
    fontWeight: '700',
  },

  sectionTitle: {
    marginTop: 25,
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },

  description: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    lineHeight: 15,
  },
  button: {
    marginTop: 35,
    backgroundColor: '#22C3B5',
    paddingVertical: 10, // ↓ reduced height
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14, // slightly smaller for better fit
  },

  mapContainer: {
    height: 200,
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#f9f9f9',
  },

  map: {
    flex: 1,
  },
});
