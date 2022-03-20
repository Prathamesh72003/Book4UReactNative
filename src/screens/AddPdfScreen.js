import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  ToastAndroid,
  Text,
  View,
  Platform,
  TextInput,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import SelectDropdown from 'react-native-select-dropdown';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import fs from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import axios from '../axios/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getThumbnail from '../components/Thumbnail';
import {departmentDropdown} from '../components/DepDropdown';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Width = Dimensions.get('window').width;

const AddPdfScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [year, setYear] = useState(1);
  const [department, setDepartment] = useState(1);
  const [subject, setSubject] = useState('613f8441c9fad3ccf92f1c0d');
  const [localImage, setLocalImage] = useState(null);
  const [transfer, setTransfer] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [yearsDropdown, setYearsDropdown] = useState([
    {id: 1, name: '1st year'},
    {id: 2, name: '2nd year'},
    {id: 3, name: '3rd year'},
  ]);
  const [subjectDropdown, setSubjectDropdown] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [info, setInfo] = useState(false);

  useEffect(async () => {
    const user_data = await AsyncStorage.getItem('user');
    const user_json = JSON.parse(user_data);
    setUser(JSON.parse(user_data));
    get_subject_dropdown(1);
  }, []);

  const get_subject_dropdown = id => {
    setProcessing(true);
    setSubjectDropdown([]);
    axios
      .get('/get_dropdown_subject', {params: {id: id}})
      .then(response => {
        response.data.map(item => {
          setSubjectDropdown(prev => [...prev, item]);
        });
        setProcessing(false);
      })
      .catch(error => {
        console.log(error);
        setProcessing(false);
        ToastAndroid.show(
          'Error occured. Please try again',
          ToastAndroid.SHORT,
        );
      });
    if (loading) setLoading(false);
  };

  const uploadfiles = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      console.log(res);
      if (res[0].size <= 4000000) {
        let uri = await getThumbnail(res[0].uri);
        // console.log(uri);
        setImageUrl(uri);
        setLocalImage(res[0].uri);
      } else {
        ToastAndroid.show(
          'PDF size should be less than 4MB',
          ToastAndroid.LONG,
        );
      }
      // console.log(res + '\n');
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const getPathForFirebaseStorage = async uri => {
    if (Platform.OS === 'ios') {
      return uri;
    }
    const stat = await RNFetchBlob.fs.stat(uri);
    return stat.path;
  };

  const submitFun = async () => {
    if (name.length > 0 && message.length > 0 && localImage != null) {
      try {
        let fileName =
          localImage.substring(localImage.lastIndexOf('/') + 1) + Date.now();
        let destPath = '';
        if (localImage.startsWith('content://')) {
          const urlComponents = localImage.split('/');
          const fileNameAndExtension = urlComponents[urlComponents.length - 1];
          destPath = `${fs.TemporaryDirectoryPath}/${fileNameAndExtension}`;
          await fs.copyFile(localImage, destPath);
          setLocalImage(destPath);
          // console.log(destPath);
          destPath = 'file://' + destPath;
        } else {
          destPath = localImage;
        }
        // let finalPath = "file://"+destPath;
        console.log(destPath);
        setTransfer(0);
        setUploading(true);
        await storage()
          .ref(fileName + '_img')
          .putFile(imageUrl);
        const Img_url = await storage()
          .ref(fileName + '_img')
          .getDownloadURL();
        // const path = await getPathForFirebaseStorage(localImage);
        const task = storage()
          .ref(fileName)
          .putFile('file://' + destPath);
        task.on('state_changed', taskSnapshot => {
          setTransfer(
            Math.round(
              taskSnapshot.bytesTransferred / taskSnapshot.totalBytes,
            ) * 100,
          );
        });
        task.then(async () => {
          const firebaseUrl = await storage().ref(fileName).getDownloadURL();
          console.log('firebase url: ' + firebaseUrl);
          // name.trim();
          // name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
          let data = {
            name: name.trim(),
            uploader_id: user.id,
            pdf_url: firebaseUrl,
            img_url: Img_url,
            department_id: department,
            subject_id: subject,
            viewers: 10,
            description: message.trim(),
          };
          axios
            .post('/upload_pdf', data)
            .then(response => {
              ToastAndroid.show(
                'Pdf uploaded successfully.',
                ToastAndroid.SHORT,
              );
              setLocalImage(null);
              setMessage('');
              setName('');
              setUploading(false);
              navigation.navigate('MyPdfs');
            })
            .catch(err => {
              console.log(err);
              ToastAndroid.show(
                'Something went wrong please try again.',
                ToastAndroid.SHORT,
              );
            });
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      ToastAndroid.show('All fields are required', ToastAndroid.SHORT);
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
      <View style={styles.topContainer}>
        <Text style={styles.mainHeading}>Upload pdf</Text>
        <TouchableOpacity onPress={() => setInfo(!info)}>
          <FontAwesome5 name="info-circle" size={18} color={'#000'} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={[styles.inputContainer, {alignItems: 'center'}]}>
          <Text style={styles.inputHeader}>Name: </Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setName(text)}
            value={name}
            placeholder="Type here..."
            placeholderTextColor={'grey'}
          />
        </View>
        <View style={[styles.inputContainer, {flexDirection: 'column'}]}>
          <Text style={styles.inputHeader}>Description: </Text>
          <View style={styles.messageContainer}>
            <TextInput
              style={styles.messageInput}
              value={message}
              //   numberOfLines={4}
              multiline={true}
              onChangeText={text => setMessage(text)}
              placeholder="Type here..."
              placeholderTextColor={'grey'}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.pdfPicker} onPress={uploadfiles}>
          <Text style={styles.pdfPickerText}>Pick a pdf</Text>
        </TouchableOpacity>
        <View style={[styles.dropdownContainer]}>
          <Text style={styles.inputHeader}>Year: </Text>
          <SelectDropdown
            data={yearsDropdown}
            defaultValueByIndex={0}
            buttonStyle={styles.dropdown}
            onSelect={(selectedItem, index) => {
              setYear(selectedItem.id);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem.name;
            }}
            rowTextForSelection={(item, index) => {
              return item.name;
            }}
            renderDropdownIcon={() => {
              return (
                <FontAwesome5 name="caret-down" size={15} color={'#fff'} />
              );
            }}
          />
        </View>
        <View style={[styles.dropdownContainer]}>
          <Text style={styles.inputHeader}>Department: </Text>
          <SelectDropdown
            data={departmentDropdown}
            defaultValueByIndex={0}
            buttonStyle={styles.dropdown}
            onSelect={(selectedItem, index) => {
              get_subject_dropdown(selectedItem.id);
              setDepartment(selectedItem.id);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem.name;
            }}
            rowTextForSelection={(item, index) => {
              return item.name;
            }}
            renderDropdownIcon={() => {
              return (
                <FontAwesome5 name="caret-down" size={15} color={'#fff'} />
              );
            }}
          />
        </View>
        <View style={[styles.dropdownContainer]}>
          <Text style={styles.inputHeader}>Subject: </Text>
          {processing == false ? (
            <SelectDropdown
              data={subjectDropdown}
              defaultValueByIndex={0}
              buttonStyle={styles.dropdown}
              onSelect={(selectedItem, index) => {
                setSubject(selectedItem.id);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.name;
              }}
              rowTextForSelection={(item, index) => {
                return item.name;
              }}
              renderDropdownIcon={() => {
                return (
                  <FontAwesome5 name="caret-down" size={15} color={'#fff'} />
                );
              }}
            />
          ) : (
            <View>
              <ActivityIndicator size="small" color={'#000'} />
            </View>
          )}
        </View>
        {uploading ? (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.wrapper}>
              <Text style={{fontSize: 16, color: '#fff'}}>
                {transfer} % complete
              </Text>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.submitBtnContainer}
            onPress={submitFun}>
            <View style={styles.submitBtn}>
              <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>
                Submit
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
      {info ? (
        <View style={styles.infoContainer}>
          <TouchableOpacity
            style={styles.infoClose}
            onPress={() => setInfo(false)}>
            <FontAwesome5 name="times" color={'#fff'} size={20} />
          </TouchableOpacity>
          <Text style={styles.infoHeading}>PDF must contain :-</Text>
          <View style={{margin: 15}}>
            <Text style={styles.infoText}>» Proper name and description</Text>
            <Text style={styles.infoText}>
              » PDF size should not exceed 4MB
            </Text>
            <Text style={styles.infoText}>» Well scanned PDF</Text>
            <Text style={styles.infoText}>
              » Thumbnail and index as its first two pages
            </Text>
            <Text style={styles.infoText}>» Valid and appropriate content</Text>
          </View>
          <Text style={styles.infoSubtitle}>
            All above mentioned points must be followed for easy approval!
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default AddPdfScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 10,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainHeading: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    // marginHorizontal: 20,
    // marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    // backgroundColor: '#ddd',
    marginVertical: 10,
  },
  inputHeader: {
    marginRight: 10,
    color: '#000',
    fontWeight: '500',
    fontSize: 20,
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
  messageContainer: {
    marginTop: 10,
    height: 100,
    borderWidth: 1,
    borderRadius: 10,
    padding: 2,
  },
  messageInput: {
    justifyContent: 'flex-start',
    color: '#000',
    padding: 5,
  },
  dropdownContainer: {
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdown: {
    width: Width / 2,
    backgroundColor: '#ddd',
    padding: 0,
    height: 35,
    borderRadius: 10,
    justifyContent: 'flex-start',
    margin: 0,
  },
  pdfPicker: {
    backgroundColor: '#ddd',
    width: 120,
    height: 45,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  pdfPickerText: {
    color: '#000',
  },
  submitBtnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 140,
    height: 50,
    borderRadius: 20,
    backgroundColor: '#3f48cc',
  },
  wrapper: {
    // position: 'absolute',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3f48cc',
    width: 150,
    height: 80,
  },
  infoContainer: {
    position: 'absolute',
    height: 300,
    bottom: 0,
    zIndex: 10,
    width: Width,
    padding: 20,
    justifyContent: 'center',
    // paddingVertical: 40,
    backgroundColor: '#3ec9c1',
    elevation: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  infoClose: {
    position: 'absolute',
    right: 20,
    zIndex: 20,
    top: 20,
  },
  infoHeading: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#000',
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 16,
    color: '#000',
  },
  infoSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
