import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

import Svg, {Path} from 'react-native-svg';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const FirstScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Image style={styles.bgImg} source={require('../assets/firstBg.png')} />
      <View style={styles.upperContainer}>
        <View style={styles.titleBar}>
          <Image
            source={require('../assets/logo.png')}
            style={{height: 75, width: 75}}
          />
          <Text style={styles.title}>Book4u</Text>
          <Text style={styles.tagline}>Think better, Think Book4u!!</Text>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.form}>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={() => navigation.replace('Login')}
              style={styles.btn}>
              <Text style={styles.btnText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.replace('SignUp')}
              style={styles.btn2}>
              <Text style={styles.btnText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default FirstScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bgImg: {
    position: 'absolute',
    height: Height + 210,
    width: Width,
    resizeMode: 'contain',
  },
  svgCurve: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    zIndex: 100,
  },
  upperContainer: {
    padding: 20,
    height: Height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleBar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
  },
  logo: {},
  tagline: {},
  bottomContainer: {
    height: Height * 0.6,
    flex: 1,
    // backgroundColor: '#000',
  },

  form: {
    justifyContent: 'flex-end',
    // justifyContent: 'center',
    padding: 20,
    flexGrow: 1,
  },

  btnContainer: {
    alignItems: 'center',
  },
  btn: {
    backgroundColor: '#2d54ee',
    borderRadius: 20,
    height: 40,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn2: {
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#2d54ee',
    borderRadius: 20,
    height: 40,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
