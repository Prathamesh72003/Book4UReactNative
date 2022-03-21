import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
  ToastAndroid,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import auth from '@react-native-firebase/auth';
import axios from '../axios/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {departmentDropdown} from '../components/DepDropdown';
import SelectDropdown from 'react-native-select-dropdown';

import Svg, {Path} from 'react-native-svg';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const SignUpScreen = ({navigation}) => {
  const [username, setUsername] = useState();
  const [phoneNo, setPhoneNo] = useState('');
  const [emailId, setEmailId] = useState();
  const [password, setPassword] = useState();
  const [selectDepartment, setSelectDepartment] = useState(1);
  const [otpScreen, setOtpScreen] = useState(false);
  const [otp, setOtp] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [processing1, setProcessing1] = useState(false);
  const [processing2, setProcessing2] = useState(false);

  useEffect(async () => {
    await auth().signOut().then(() => {
      console.log("signout")
    }).catch((e) => {
      console.error(e);
    });
    // console.log("From useEffect of signup after signout: ", user);
    const unsubscribe = auth().onAuthStateChanged(async user => {
      // var stored_user = await AsyncStorage.getItem('user');
      console.log("From useEffect of signup: ", user);
      // console.log("OTP screen ", confirm);
    // stored_user = JSON.parse(stored_user);
      if (user!=null && user.uid) {
        ToastAndroid.show(
          'Number validated , creating user!',
          ToastAndroid.SHORT,
        );
        addUser();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const addUser = async () => {
    const user = await AsyncStorage.getItem('user');
    console.log("From add user function:"+JSON.parse(user));
    let data = {
      username: JSON.parse(user).name,
      email: JSON.parse(user).email == null ? '' : JSON.parse(user).email,
      phone_no: JSON.parse(user).phone_no,
      department_id: JSON.parse(user).department_id,
      password: JSON.parse(user).password,
    };

    axios
      .post('/add_user', data)
      .then(async response => {
        // console.log(response)
        // console.log(response.data);
        if (response.data != null) {
          await AsyncStorage.setItem('user', JSON.stringify(response.data));
          // const user = await AsyncStorage.getItem('user');
          // console.log(JSON.parse(user));
          navigation.replace('HomeScreen');
        } else {
          ToastAndroid.show(
            'Error occured while adding user, please try again',
            ToastAndroid.SHORT,
          );
        }
        setProcessing2(false);
      })
      .catch(err => {
        console.log(err);
        ToastAndroid.show(
          'Error occured while adding user, please try again',
          ToastAndroid.SHORT,
        );
        setProcessing2(false);
      });
  };

  const getOtpFun = async () => {
    // console.log(phoneNo.length);
    // console.log(username.length != 0 && password.length != 0 && phoneNo.length == 10);
    setProcessing1(true);
    if (username.length != 0 && password.length != 0 && phoneNo.length == 10) {
      axios
        .get('./check_user', {params: {user_name: username, phone_no: phoneNo}})
        .then(async response => {
          // console.log(response.data);
          if (response.data == '3') {
            ToastAndroid.show(
              'Username and phone number already exsists!',
              ToastAndroid.LONG,
            );
          } else if (response.data == '1') {
            ToastAndroid.show('Username already taken!', ToastAndroid.LONG);
          } else if (response.data == '2') {
            ToastAndroid.show(
              'Phone number already registered!',
              ToastAndroid.LONG,
            );
          } else {
            let data = {
              name: username,
              email: emailId,
              phone_no: phoneNo,
              department_id: selectDepartment,
              password: password,
              v_status: false,
            };
            await AsyncStorage.setItem('user', JSON.stringify(data));
            ToastAndroid.show(
              'Sending OTP to the given number',
              ToastAndroid.LONG,
            );
            // const user = await AsyncStorage.getItem('user');
            // console.log(JSON.parse(user));
            const confirmation = await auth().signInWithPhoneNumber(
              '+91 ' + phoneNo,
            );
            setConfirm(confirmation);
            setOtpScreen(true);
          }
          setProcessing1(false);
        })
        .catch(err => {
          setProcessing1(false);
          ToastAndroid.show(err.message, ToastAndroid.LONG);
          console.log(err.message);
        });

      // console.log(username + ' ' + password);
      // navigation.replace('HomeScreen');
    } else {
      if (phoneNo.length != 10) {
        ToastAndroid.show(
          'Please enter a valid phone number',
          ToastAndroid.SHORT,
        );
      } else {
        ToastAndroid.show(
          'Username and Password are required',
          ToastAndroid.SHORT,
        );
      }
    }
  };

  const checkOtp = async () => {
    if (otp.length == 6) {
      setProcessing2(true);
      try {
        await confirm.confirm(otp);
        // await confirm.confirm(otp);
      } catch (error) {
        console.log('Invalid code.');
        // ToastAndroid.show(error, ToastAndroid.SHORT);
        // console.log(error);
        console.log(error);
        ToastAndroid.show(error.message, ToastAndroid.LONG);
      }
      setProcessing2(false);
    } else {
      ToastAndroid.show('Please enter a 6 digit OTP', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/signupBg.png')} style={styles.bgImg} />
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
          <Text style={styles.title}>Sign Up</Text>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.form}>
          {otpScreen == false ? (
            <ScrollView>
              <View style={styles.inputContainer}>
                <Text style={styles.inputheader}>Username</Text>
                <TextInput
                  maxLength={10}
                  style={styles.input}
                  onChangeText={text => setUsername(text)}
                  value={username}
                  placeholder="Type here.."
                  placeholderTextColor={'#ddd'}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputheader}>Phone number</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={text => setPhoneNo(text)}
                  value={phoneNo}
                  keyboardType="numeric"
                  placeholder="Type here.."
                  placeholderTextColor={'#ddd'}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputheader}>Email address</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={text => setEmailId(text)}
                  value={emailId}
                  placeholder="Type here.."
                  placeholderTextColor={'#ddd'}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputheader}>Department</Text>

                <SelectDropdown
                  data={departmentDropdown}
                  defaultValueByIndex={0}
                  buttonStyle={styles.dropdown}
                  buttonTextStyle={{
                    color: '#fff',
                  }}
                  onSelect={(selectedItem, index) => {
                    setSelectDepartment(selectedItem.id);
                  }}
                  renderDropdownIcon={() => {
                    return (
                      <FontAwesome5
                        name="caret-down"
                        size={15}
                        color={'#fff'}
                      />
                    );
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.name;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.name;
                  }}
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
                {processing1 == false ? (
                  <TouchableOpacity onPress={getOtpFun} style={styles.btn}>
                    <Text style={styles.btnText}>Next</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.btn}>
                    <ActivityIndicator size={'small'} color={'#FFF'} />
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          ) : (
            <View style={{justifyContent: 'center', flex: 1}}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputheader}>Phone number</Text>
                <TextInput
                  editable={false}
                  style={styles.input}
                  onChangeText={text => setPhoneNo(text)}
                  value={phoneNo}
                  keyboardType="numeric"
                  placeholder="Type here.."
                  placeholderTextColor={'#ddd'}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputheader}>OTP</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={text => setOtp(text)}
                  keyboardType="numeric"
                  value={otp}
                  placeholder="Type here.."
                  placeholderTextColor={'#ddd'}
                />
              </View>
              <View style={styles.btnContainer}>
                {processing2 == false ? (
                  <TouchableOpacity onPress={checkOtp} style={styles.btn}>
                    <Text style={styles.btnText}>Confirm</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.btn}>
                    <ActivityIndicator size={'small'} color={'#FFF'} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default SignUpScreen;

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
    height: Height * 0.55,
    backgroundColor: '#07193f',
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputheader: {
    color: '#fff',
    fontSize: 18,
  },
  input: {
    color: '#fff',
    backgroundColor: '#535f79',
    borderRadius: 10,
    padding: 3,
    paddingHorizontal: 10,
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
  dropdown: {
    color: '#fff',
    backgroundColor: '#535f79',
    borderRadius: 10,
    padding: 3,
    width: Width - 40,
    height: 40,
    paddingHorizontal: 10,
    marginTop: 10,
  },
});