import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import dynamicLinks from '@react-native-firebase/dynamic-links';

const SplashScreen = ({navigation}) => {
  const handleDynamicLink = link => {
    // Handle dynamic link inside your own application
    console.log(link);
    if (
      link != null &&
      link.url == 'https://play.google.com/store/apps/details?id=com.book4u'
    ) {
      navigation.replace('HomeScreen');
    } else if (link == null) {
      navigation.replace('HomeScreen');
    } else {
      var pdfId = link.url;
      pdfId = pdfId.replace('https://', '');
      console.log(pdfId);
      navigation.replace('Detail', {id: pdfId});
    }
    //
  };

  setTimeout(async () => {
    const user = await AsyncStorage.getItem('user');
    if (user != null && user.v_status == true) {
      const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
      // When the component is unmounted, remove the listener

      dynamicLinks()
        .getInitialLink()
        .then(link => {
          handleDynamicLink(link);
        });
    } else {
      navigation.replace('First');
    }
    // navigation.navigate('First');
    // console.log(1);
  }, 2000);
  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        {/* <FontAwesome5
          style={styles.logo}
          name="artstation"
          size={80}
          color={'#fff'}
        /> */}
        <LottieView
          source={require('../assets/splashGif.json')}
          autoPlay
          style={{width: 300, height: 300}}
          loop
        />
        <Text style={styles.name}>BOOK4U</Text>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07193f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginBottom: 10,
  },
  name: {
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 30,
    fontFamily: 'Cochin',
    color: '#fff',
  },
});
