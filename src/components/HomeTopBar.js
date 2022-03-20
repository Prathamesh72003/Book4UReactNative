import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';

const HomeTopBar = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <FontAwesome5
        name="align-left"
        size={18}
        color={'#000'}
        onPress={() => navigation.openDrawer()}
      />
      <Text style={{fontWeight: 'bold', fontSize: 20}}>Hi SASP</Text>
      <FontAwesome5 name="shopping-cart" size={18} color={'#000'} />
    </View>
  );
};

export default HomeTopBar;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
