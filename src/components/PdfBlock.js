import React from 'react';
import {StyleSheet, Image, Text, View} from 'react-native';

const PdfBlock = props => {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: props.img,
        }}
        style={styles.img}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {props.name}
        </Text>
        <Text style={styles.subject} numberOfLines={1}>
          {props.subject}
        </Text>
      </View>
    </View>
  );
};

export default PdfBlock;

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: 140,
    marginRight: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 4,
    // marginBottom: 2,
  },
  img: {
    width: 140,
    height: 140,
    borderRadius: 10,
  },
  info: {
    paddingHorizontal: 5,
  },
  name: {
    fontSize: 20,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  subject: {},
});
