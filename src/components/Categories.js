import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';

const Categories = ({ categories = [], selectedIds = [], onSelectCategory }) => {
  const onPressCategory = (id) => {
    let newSelectedIds;
    if (selectedIds.includes(id)) {
      newSelectedIds = selectedIds.filter(itemId => itemId !== id);
    } else {
      newSelectedIds = [...selectedIds, id];
    }
    if (onSelectCategory) {
      onSelectCategory(newSelectedIds);
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedIds.includes(item.id);

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
      {categories && categories.length > 0 ? (
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
    paddingBottom: 10,
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