import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'https://ceola-unreprovable-modesto.ngrok-free.dev/api/v1/bigdaisy/categories';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();

      const data = json?.data || json?.categories || [];

      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const onPressCategory = (id) => {
    setSelectedId(prev => (prev === id ? null : id));
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedId === item.id;

    return (
      <TouchableOpacity
        onPress={() => onPressCategory(item.id)}
        style={[
          styles.button,
          isSelected && styles.buttonActive,
        ]}
      >
        <Text style={[styles.text, isSelected && styles.textActive]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>

      {/* Loader */}
      {loading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : categories.length > 0 ? (
        <FlatList
          data={categories}
          horizontal
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
        />
      ) : null}

    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    paddingHorizontal: 20,
  },

  button: {
    backgroundColor: '#e5e5e5',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginHorizontal: 6,
  },

  buttonActive: {
    backgroundColor: '#000',
  },

  text: {
    color: '#000',
    fontSize: 13,
    fontWeight: '600',
  },

  textActive: {
    color: '#fff',
  },
});