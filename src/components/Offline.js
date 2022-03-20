import React from 'react';
import {Text, View, ToastAndroid} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const Offline = () => {
  NetInfo.fetch().then(state => {
    if (!state.isConnected) {
      ToastAndroid.show(
        'You are Offline, please check your internet connection!',
        ToastAndroid.LONG,
      );
      return false;
    } else {
      return true;
    }
  });
};

export default Offline;
