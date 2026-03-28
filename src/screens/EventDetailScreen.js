import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const EventDetailScreen = ({ route }) => {
  const { event } = route.params;

  const openMap = location => {
    if (!location) return;

    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      location,
    )}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* IMAGE HEADER */}
      <Image
        source={{
          uri: event?.banner_image_url || 'https://via.placeholder.com/400',
        }}
        style={styles.image}
      />

      {/* CONTENT CARD */}
      <View style={styles.content}>

        {/* TITLE */}
        <Text style={styles.title}>{event?.title}</Text>

        {/* DATE */}
        <Text style={styles.date}>
          {event?.start_date
            ? new Date(event.start_date).toDateString()
            : 'No Date'}
        </Text>

        {/* LOCATION */}
        <TouchableOpacity
          style={styles.locationBox}
          onPress={() => openMap(event?.location)}
        >
          <Icon name="location-outline" size={20} color="#555" />
          <Text style={styles.locationText}>
            {event?.location || 'No location'}
          </Text>
        </TouchableOpacity>

        {/* PRICE */}
        <View style={styles.priceBox}>
          <Text style={styles.priceText}>
            {event?.price ? `$${event.price}` : 'Free Event'}
          </Text>
        </View>

        {/* DESCRIPTION */}
        <Text style={styles.sectionTitle}>About Event</Text>
        <Text style={styles.description}>
          {event?.description ||
            'No description available for this event. Stay tuned for more details.'}
        </Text>

        {/* BUTTON */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Get Ticket</Text>
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

  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  locationText: {
    marginLeft: 6,
    color: '#555',
    fontSize: 14,
    textDecorationLine: 'underline',
  },

  priceBox: {
    marginTop: 12,
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
    marginTop: 18,
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
    marginTop: 25,
    backgroundColor: '#22C3B5',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});