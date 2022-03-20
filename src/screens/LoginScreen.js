import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Image,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axios from '../axios/axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import WavyHeader from '../components/WavyHeader';
import Svg, {Path} from 'react-native-svg';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [processing, setProcessing] = useState(false);

  const loginFun = async () => {
    if (username.length != 0 && password.length != 0) {
      setProcessing(true);
      axios
        .get('/login_function', {
          params: {user_name: username, password: password},
        })
        .then(async response => {
          // setUsername(user_name)
          // console.log(response.data);
          if (response.data != false) {
            await AsyncStorage.setItem('user', JSON.stringify(response.data));
            // const user_data = await AsyncStorage.getItem('user');
            // console.log(JSON.parse(user_data));
            ToastAndroid.show('Logged in succesfull', ToastAndroid.SHORT);
            navigation.replace('HomeScreen');
            setProcessing(false);
          } else {
            ToastAndroid.show(
              'Username or password is incorrected ',
              ToastAndroid.SHORT,
            );
            setProcessing(false);
          }
        })
        .catch(err => {
          ToastAndroid.show(
            'Failed to login please try again',
            ToastAndroid.SHORT,
          );
          setProcessing(false);
          console.log(err);
        });
    } else {
      ToastAndroid.show('All fields are required', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/loginBg.png')} style={styles.bgImg} />
      <View style={styles.upperContainer}>
        <View style={styles.backCircle} />
        <View style={styles.backBtn}>
          <TouchableOpacity
            style={{flexDirection: 'row', zIndex: 100}}
            onPress={() => navigation.replace('First')}>
            <FontAwesome5 size={22} color={'#fff'} name="arrow-left" />
            <Text style={{color: '#fff', fontSize: 18, marginLeft: 10}}>
              Back
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.titleBar}>
          <Text style={styles.title}>Log In</Text>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.form}>
          <ScrollView>
            <View style={styles.inputContainer}>
              <Text style={styles.inputheader}>Username</Text>
              <TextInput
                style={styles.input}
                onChangeText={text => setUsername(text)}
                value={username}
                placeholder="Type here.."
                placeholderTextColor={'#ddd'}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputheader}>Password</Text>
              <TextInput
                secureTextEntry={true}
                style={styles.input}
                onChangeText={text => setPassword(text)}
                value={password}
                placeholder="Type here.."
                placeholderTextColor={'#ddd'}
              />
            </View>
            <View style={styles.btnContainer}>
              {processing == false ? (
                <TouchableOpacity onPress={loginFun} style={styles.btn}>
                  <Text style={styles.btnText}>Log In</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.btn}>
                  <ActivityIndicator size={'small'} color="#fff" />
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bgImg: {
    position: 'absolute',
    height: Height,
    width: Width,
    resizeMode: 'contain',
  },
  upperContainer: {
    padding: 20,
    height: Height * 0.3,
  },
  backCircle: {
    position: 'absolute',
    left: -100,
    width: 300,
    height: 300,
    top: -150,
    borderRadius: 150,
    backgroundColor: '#2d54ee',
  },
  backBtn: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  titleBar: {},
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  bottomContainer: {
    flex: 1,
    height: Height * 0.7,
    justifyContent: 'flex-end',
    // backgroundColor: '#000',
  },

  form: {
    paddingHorizontal: 20,
    paddingBottom: 18,
    // flexGrow: 1,
    backgroundColor: '#07193f',
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputheader: {
    color: '#fff',
    fontSize: 20,
  },
  input: {
    color: '#fff',
    backgroundColor: '#535f79',
    borderRadius: 10,
    paddingHorizontal: 10,
    padding: 5,
    marginTop: 10,
  },
  btnContainer: {
    alignItems: 'center',
    marginTop: 25,
  },
  btn: {
    backgroundColor: '#2d54ee',
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
