import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  Button,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  Share,
  ActivityIndicator,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import RNFetchBlob from 'rn-fetch-blob';

import axios from '../axios/axios';
import fs from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getThumbnail from '../components/Thumbnail';
import dynamicLinks from '@react-native-firebase/dynamic-links'; 

const {width, height} = Dimensions.get('window');

const DetailScreen = ({navigation, route}) => {
  
  const [pdfId, setPdfId] = useState();
  const [details, setDetails] = useState();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [isBookmark, setIsBookmark] = useState(true);
  const [processingBookmark, setProcessingBookmark] = useState(null);
  useEffect(async () => {
    const user_data = await AsyncStorage.getItem('user');
    const user_json = JSON.parse(user_data);
    setUser(user_json);
    setPdfId(route.params.id);
    axios
      .get('/pdf_details', {params: {id: route.params.id}})
      .then(async response => {
        setDetails(response.data);
        // console.log(response.data);

        axios
          .get('/is_bookmark', {
            params: {user_id: user_json.id, pdf_id: response.data.id},
          })
          .then(res => {
            setIsBookmark(res.data);
            // console.log(res.data);
          })
          .catch(err => {
            console.log(err);
            ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
            setLoading(false);
          });
        setLoading(false);
        // console.log(user);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  }, []);
  const onShare = async pdf_name => {
    
    const link = await dynamicLinks().buildLink({
      link: ("https://"+pdfId).toString(),
      // domainUriPrefix is created in your Firebase console
      domainUriPrefix: 'https://saspbook4u.page.link/',
    });

    console.log(link);
    try {
      const result = await Share.share({
        message:
          'Checkout this amazing ' +
          pdf_name +
          " pdf I'm reading at Book4u! "+ link,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const downloadPDF = async (url, fileName) => {
    //Define path to store file along with the extension

    const dir = `${fs.DocumentDirectoryPath}/.book4u`;
    const exist = await fs.exists(dir);
    // console.log(exist);
    if (exist == false) {
      fs.mkdir(dir)
        .then(() => {})
        .catch(error => console.log(error));
    } else {
    }
    const path = `${dir}/${details.name}.pdf`;
    // console.log(path);

    const options = {
      fromUrl: details.pdf_url,
      toFile: path,
    };
    //Call downloadFile
    const response = fs
      .downloadFile(options)
      .promise.then(res => {
        // console.log(res && res.statusCode === 200 && res.bytesWritten != 0);
        if (res && res.statusCode === 200 && res.bytesWritten > 0) {
          ToastAndroid.show('Download completed', ToastAndroid.SHORT);
          axios
            .get('/add_download', {
              params: {user_id: user.id, pdf_id: details.id},
            })
            .then(response => {
              // console.log(response.data);
            })
            .catch(err => {
              console.log(err);
            });
          navigation.navigate('ReadPdf', {
            name: details.name,
            url: path,
            type: 'file',
          });
          // console.log(res);
        } else {
          ToastAndroid.show(
            'Error occured while downloading...maybe you have already downloaded',
            ToastAndroid.SHORT,
          );
          // console.log(res);
        }
      })
      .catch(err => {
        ToastAndroid.show(
          'Error occured while downloading...',
          ToastAndroid.SHORT,
        );
        console.log(err);
      });
  };

  const downloadPdff = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ToastAndroid.show('Download has started...', ToastAndroid.SHORT);
        downloadPDF();
      } else {
        Alert.alert(
          'Permission Denied!',
          'You need to give storage permission to download the file',
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const setBookmark = state => {
    if (state == true) {
      setProcessingBookmark(true);
      // console.log('adding');
      axios
        .get('/set_bookmark', {
          params: {user_id: user.id, pdf_id: details.id, state: state},
        })
        .then(response => {
          // console.log(response.data);
          setIsBookmark(state);
          setProcessingBookmark(null);
        })
        .catch(err => {
          console.log(err);
          setProcessingBookmark(null);
          ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
        });
    } else {
      setProcessingBookmark(false);
      axios
        .get('/set_bookmark', {
          params: {user_id: user.id, pdf_id: details.id, state: state},
        })
        .then(response => {
          setIsBookmark(state);
          setProcessingBookmark(null);
        })
        .catch(err => {
          console.log(err);
          setProcessingBookmark(null);
          ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
        });
    }
  };

  // console.log(route.params.id);
  if (loading) {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <ActivityIndicator size={'large'} color="#3f48cc" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ScrollView style={{flex: 1}}>
        <View style={styles.Topcontainer}>
          <TouchableOpacity
            style={styles.backComponent}
            onPress={() => {
                try{
                  navigation.goBack();
                }catch(error){
                  console.log(error)
                  navigation.replace("HomeScreen")
                }
            }}>
            <FontAwesome5 name="arrow-left" size={20} color={'#000'} />
          </TouchableOpacity>
          <View style={styles.imageComponent}>
            <Image
              source={{
                uri: details.img_url,
              }}
              style={styles.image}
            />
          </View>
          <View style={styles.iconContainer}>
            {isBookmark == true ? (
              <TouchableOpacity
                style={styles.bookmarkComponent}
                onPress={() => setBookmark(false)}>
                <MaterialIcons name="bookmark" size={20} color={'#000'} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.bookmarkComponent}
                onPress={() => setBookmark(true)}>
                <MaterialIcons
                  name="bookmark-outline"
                  size={20}
                  color={'#000'}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.bookmarkComponent}
              onPress={() => onShare(details.name)}>
              <MaterialIcons name="share" size={20} color={'#000'} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.pdfname}>{details.name}</Text>
          <Text style={styles.subname}>{details.subject_name}</Text>
        </View>
        <View style={styles.blockContainer}>
          <View style={styles.block}>
            <Text style={styles.blocknumber}>{details.viewers}</Text>
            <Text style={styles.blocktext}>Views</Text>
          </View>
          <View style={styles.line} />
          <View style={styles.block}>
            <Text style={[styles.blocknumber]} numberOfLines={1}>
              {details.user_name}
            </Text>
            <Text style={styles.blocktext}>Uploader</Text>
          </View>
          {/* <View style={styles.line} />
          <View style={styles.block}>
            <Text style={styles.blocknumber}>50</Text>
            <Text style={styles.blocktext}>Views</Text>
          </View> */}
        </View>
        <View style={styles.decriptionContainer}>
          <Text style={styles.Descheading}>About this PDF</Text>
          <Text style={styles.Desccontent}>{details.description}</Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.downloadContainer}
          onPress={downloadPdff}>
          <View style={styles.downloadButton}>
            <Text style={{fontWeight: 'bold', color: '#000'}}>Download</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.readNowContainer}
          onPress={() =>
            navigation.navigate('ReadPdf', {
              name: details.name,
              url: details.pdf_url,
              type: 'url',
            })
          }>
          <View style={styles.readNowButton}>
            <Text style={styles.readNowText}>Read Now</Text>
          </View>
        </TouchableOpacity>
        {processingBookmark == null ? null : processingBookmark == true ? (
          <View style={styles.bookmarkStatus_container}>
            <Text style={styles.status}>Adding</Text>
          </View>
        ) : (
          <View style={styles.bookmarkStatus_container}>
            <Text style={styles.status}>Removing</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  Topcontainer: {
    height: height * 0.4,
    backgroundColor: '#fff',
  },
  backComponent: {
    backgroundColor: '#fff',
    width: 30,
    height: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 20,
    top: 30,
    elevation: 2,
  },
  imageComponent: {
    width: width,
    height: height * 0.4,
    zIndex: -10,
    elevation: 2,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  image: {
    width: width,
    height: height * 0.4,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    // resizeMode: "contain",
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    top: 30,
  },
  bookmarkComponent: {
    backgroundColor: '#fff',
    width: 30,
    height: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    marginBottom: 10,
  },

  textContainer: {
    margin: 20,
  },
  pdfname: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#000',
  },
  subname: {
    fontSize: 17,
    fontWeight: '300',
    opacity: 0.7,
    color: '#000',
  },
  blockContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'space-around',
    elevation: 10,
    backgroundColor: '#fff',
    height: 60,
    marginBottom: 10,
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  block: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  blocknumber: {
    fontSize: 15,
    fontWeight: '300',
  },
  blocktext: {
    fontSize: 12,
    opacity: 0.8,
  },
  line: {
    backgroundColor: '#000',
    width: 2,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
    marginVertical: 9,
  },
  decriptionContainer: {
    margin: 20,
  },
  Descheading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#000',
  },
  Desccontent: {
    color: '#000',
    opacity: 0.6,
  },
  footer: {
    backgroundColor: '#fff',
    height: 60,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 5,
    justifyContent: 'space-around',
  },
  downloadContainer: {
    // backgroundColor: '#CCCCCC',
    borderWidth: 2,
    borderColor: '#2d54ee',
    width: 100,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  downloadButton: {
    fontWeight: 'bold',
  },
  readNowContainer: {
    backgroundColor: '#2d54ee',
    width: 200,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  readNowButton: {},
  readNowText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bookmarkStatus_container: {
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#000',
    marginHorizontal: 5,
    position: 'absolute',
    bottom: 10,
    zIndex: 1000,
    width: width - 40,
    height: 50,
  },
  status: {
    color: '#fff',
    fontSize: 15,
  },
});
