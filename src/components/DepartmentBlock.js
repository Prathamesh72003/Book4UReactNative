import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const DepartmentBlock = props => {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: props.img,
        }}
        style={styles.img}
      />
      <Text style={styles.title} numberOfLines={1}>
        {props.name}{' '}
      </Text>
      <Text style={styles.total}>Total: {props.total}</Text>
    </View>
  );
};

export default DepartmentBlock;

const styles = StyleSheet.create({
  container: {
    width: (width - 75) / 4,
    height: 80,
    backgroundColor: '#fff',
    margin: 5,
    elevation: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    height: 30,
    width: 30,
  },
  title: {
    // width: 70,
    fontWeight: '300',
    fontSize: 13,
    color: '#000',
  },
  total: {
    fontSize: 12,
    opacity: 0.8,
  },
});
