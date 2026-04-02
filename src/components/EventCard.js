import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const EventCard = ({ item }) => {
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(false);

  const formatStartDate = (startObj) => {
    if (!startObj) return 'Date TBD';
    const sDate = new Date(startObj);
    const sMonth = sDate.toLocaleString('default', { month: 'short' });
    const sDay = sDate.getDate();
    const sYear = sDate.getFullYear();
    return `${sMonth} ${sDay}, ${sYear}`;
  };

  const dateText = formatStartDate(item.start_date);
  const priceText = item.price && item.price !== 0 && item.price !== '0' ? `$${item.price}` : 'Free';

  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('EventDetail', { event: item })}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.banner_image_url || 'https://via.placeholder.com/400' }}
            style={styles.image}
          />
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>{priceText}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.dateRow}>
            <Text style={styles.dateText}>{dateText}</Text>
            <View style={styles.iconRow}>
              <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)} style={styles.iconButton}>
                <Icon name={isFavorite ? "heart" : "heart-outline"} size={22} color={isFavorite ? "#a32334ff" : "#888"} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Icon name="share-social-outline" size={22} color="#888" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.detailsRow}>
            <Text style={styles.location}>
              {[item.city, item.state, item.country].filter(Boolean).join(', ') || item.location || 'No location'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
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
