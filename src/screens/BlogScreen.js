import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Header from '../components/Header';

const BlogScreen = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  //  FETCH FAKE BLOGS
  const fetchBlogs = async () => {
    try {
      const res = await fetch(
        'https://jsonplaceholder.typicode.com/posts?_limit=20'
      );
      const data = await res.json();

      // add image to each blog
      const formatted = data.map(item => ({
        ...item,
        image: `https://picsum.photos/400/30${item.id}`,
      }));

      setBlogs(formatted);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  //  CARD UI
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          <Text style={styles.desc} numberOfLines={3}>
            {item.body}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  //  LOADING
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#22C3B5" />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
     <Header />
     <View style={styles.container}>
      <FlatList
        data={blogs}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
      </View>
    </View>
  );
};

export default BlogScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
    padding: 10,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    height: 350,
  },

  image: {
    width: '100%',
    height: 250,
  },

  content: {
    padding: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },

  desc: {
    marginTop: 6,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});