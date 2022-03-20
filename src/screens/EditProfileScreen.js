import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import WavyHeader from '../components/WavyHeader';
import axios from '../axios/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('window');

const EditProfileScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [user, setUser] = useState();
  const [userDetails, setUserDetails] = useState();

  useEffect(async () => {
    let user_data = await AsyncStorage.getItem('user');
    const user_json = JSON.parse(user_data);
    get_user_details(user_json);
    // console.log(user_json);
    setUser(user_json);
    navigation.setOptions({
      title: 'Edit Profile',
    });
  }, []);

  const get_user_details = async user => {
    axios
      .get('/get_user_details', {params: {id: user.id}})
      .then(response => {
        // console.log(response.data);
        setUserDetails(response.data);
        setFirstName(response.data.first_name);
        setLastName(response.data.last_name);
        setEmail(response.data.email);
        setGender(response.data.gender);
        setLoading(false);
      })
      .catch(err => {
        ToastAndroid.show(
          'Error occured , please try again',
          ToastAndroid.SHORT,
        );
        console.log(err);
        setLoading(false);
      });
  };

  const updateDetails = async () => {
    let newDetails = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      gender: gender,
    };
    // console.log('new: ' + JSON.stringify(newDetails));
    // console.log('old: ' + JSON.stringify(userDetails));
    if (JSON.stringify(newDetails) == JSON.stringify(userDetails)) {
      ToastAndroid.show('No changes made', ToastAndroid.SHORT);
      navigation.replace('HomeScreen', {screen: 'Profile'});
      // console.log('no changes');
    } else {
      axios
        .post('/edit_profile', {
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
          gender: gender,
        })
        .then(response => {
          // console.log(response.data);
          ToastAndroid.show('Changes updated', ToastAndroid.SHORT);
          navigation.replace('HomeScreen', {screen: 'Profile'});
        })
        .catch(err => {
          ToastAndroid.show('Error occured', ToastAndroid.SHORT);
          console.log(err);
          navigation.replace('HomeScreen', {screen: 'Profile'});
        });
      // console.log('changes');
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#FFF',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color={'#07193f'} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <WavyHeader
        customStyles={styles.svgCurve}
        customHeight={height * 0.3}
        customTop={130}
        customBgColor="#3f48cc"
        customWavePattern="M0,160L40,149.3C80,139,160,117,240,138.7C320,160,400,224,480,224C560,224,640,160,720,122.7C800,85,880,75,960,101.3C1040,128,1120,192,1200,202.7C1280,213,1360,171,1400,149.3L1440,128L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
      />
      <View style={styles.topContainer}>
        <View
          style={[
            styles.profileImg,
            {
              backgroundColor: user.color,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <Text
            style={{
              fontSize: 30,
              fontWeight: 'bold',
              textTransform: 'capitalize',
            }}>
            {user.name.slice(0, 1)}
          </Text>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
      </View>
      <View style={styles.formContainer}>
        <ScrollView>
          <View style={styles.inputContainer}>
            <Text style={styles.inoutHeader}>First Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => setFirstName(text)}
              value={firstName}
              placeholder="type here..."
              placeholderTextColor={'#ddd'}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inoutHeader}>Last Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => setLastName(text)}
              value={lastName}
              placeholder="type here..."
              placeholderTextColor={'#ddd'}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inoutHeader}>Email Id</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => setEmail(text)}
              value={email}
              placeholder="type here..."
              placeholderTextColor={'#ddd'}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inoutHeader}>Gender</Text>
            {/* <TextInput
              style={styles.input}
              onChangeText={text => setGender(text)}
              value={gender}
              placeholder="type here..."
              placeholderTextColor={'#ddd'}
            /> */}
            <View style={styles.genderContainer}>
              <TouchableOpacity
                onPress={() => setGender('male')}
                style={[
                  styles.boxContainer,
                  {backgroundColor: gender == 'male' ? '#000' : '#fff'},
                ]}>
                <View style={styles.box}>
                  <FontAwesome5
                    name="male"
                    size={18}
                    color={gender == 'male' ? '#fff' : '#000'}
                  />
                  <Text style={{color: gender == 'male' ? '#fff' : '#000'}}>
                    Male
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.boxContainer,
                  {backgroundColor: gender == 'female' ? '#000' : '#fff'},
                ]}
                onPress={() => setGender('female')}>
                <View style={styles.box}>
                  <FontAwesome5
                    name="female"
                    size={18}
                    color={gender == 'female' ? '#fff' : '#000'}
                  />
                  <Text style={{color: gender == 'female' ? '#fff' : '#000'}}>
                    Female
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={styles.saveBtnContainer}
            onPress={updateDetails}>
            <View style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Save</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  svgCurve: {
    position: 'absolute',
    width: Dimensions.get('window').width,
  },
  topContainer: {
    // backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.35,
  },
  profileImg: {
    width: 60,
    height: 60,
    borderRadius: 60,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 22,
    marginTop: 10,
    color: '#fff',
  },
  formContainer: {
    marginTop: 10,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#ddd',
    marginVertical: 15,
  },
  inoutHeader: {
    marginRight: 10,
    color: '#000',
    opacity: 0.6,
  },
  input: {
    flexGrow: 1,
    // alignSelf: 'stretch',
    borderBottomWidth: 1,
    fontWeight: 'bold',
    color: '#000',
    padding: 0,
  },
  saveBtnContainer: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtn: {
    width: 100,
    height: 40,
    backgroundColor: '#3f48cc',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
  },
  boxContainer: {
    width: 100,
    height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    // backgroundColor: '#fff',
  },
  box: {
    flex: 1,
    flexDirection: 'row',
    width: 80,
    justifyContent: 'space-around',
    // justifyContent: 'center',
    alignItems: 'center',
  },
});
