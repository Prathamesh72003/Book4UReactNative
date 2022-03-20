import React, {useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Linking,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  Button,
  ToastAndroid,
} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import RNFetchBlob from 'rn-fetch-blob';
import axios from '../axios/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import storage, {firebase} from '@react-native-firebase/storage';

const {width, height} = Dimensions.get('window');

const subs = [
  {
    id: 1,
    name: 'Python',
    viewers: 50,
    status: 'Approval is pending',
  },
];

const MyPdfsScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [myPdf, setMyPdf] = useState([]);
  const [user, setUser] = useState();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(async () => {
    get_users_pdf();

    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#07193f',
      },
      headerTintColor: '#fff',
      title: "My PDF's ",
    });
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    get_users_pdf();
    setRefreshing(false);
  }, []);

  const get_users_pdf = async () => {
    const user_data = await AsyncStorage.getItem('user');
    const user_json = JSON.parse(user_data);
    setUser(user_json);
    axios
      .get('/get_users_pdf', {
        params: {
          id: user_json.id,
        },
      })
      .then(response => {
        setMyPdf(response.data);

        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const openPdf = (name, url) => {
    navigation.navigate('ReadPdf', {name: name, url: url});
  };

  const deletePdf = async (id, pdf_url, img_url) => {
    console.log(id + ' ' + pdf_url + ' ' + img_url);

    axios
      .get('/delete_pdf', {
        params: {id: id, user_id: user.id, img_url: img_url, pdf_url: pdf_url},
      })
      .then(response => {
        // console.log(response.data);
        ToastAndroid.show(
          'PDF deleted , if you wish you can upload a new pdf now!',
          ToastAndroid.LONG,
        );
        get_users_pdf();
      })
      .catch(err => {
        console.log(err);
        ToastAndroid.show(
          'Some error occured while deleting!',
          ToastAndroid.SHORT,
        );
      });
  };

  if (loading) {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <ActivityIndicator size={'large'} color="#3f48cc" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ScrollView
        style={{flex: 1}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {myPdf.length != 0 ? (
          <View style={styles.blockContainer}>
            {myPdf.map((item, index) => {
              return (
                <TouchableOpacity
                  style={styles.block}
                  key={index}
                  onPress={() => openPdf(item.name, item.pdf_url)}>
                  {item.status == 'false' ? (
                    <TouchableOpacity
                      onPress={() =>
                        deletePdf(item.id, item.pdf_url, item.img_url)
                      }
                      style={{
                        position: 'absolute',
                        right: 10,
                        top: 10,
                        zIndex: 10,
                      }}>
                      <FontAwesome5 name="trash" size={18} color={'#000'} />
                    </TouchableOpacity>
                  ) : null}
                  <View style={styles.imageContainer}>
                    <Image
                      style={styles.subImage}
                      source={{
                        uri: item.img_url,
                      }}
                    />
                  </View>
                  <View style={styles.infoContainer}>
                    <Text style={styles.subName} numberOfLines={1}>
                      {item.name}
                    </Text>

                    <Text style={styles.numOfPdf} numberOfLines={1}>
                      Viewers: {item.viewers}
                    </Text>
                    <View style={styles.bookMarkStyle}>
                      <Text
                        style={{
                          color: item.status_color,
                          fontSize: 14,
                          fontWeight: '500',
                        }}
                        numberOfLines={2}>
                        Status: {item.status_msg}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: height - 50,
            }}>
            <LottieView
              source={require('../assets/upload_pdf.json')}
              autoPlay
              loop
              style={{width: 250, height: 250}}
            />
            <Text
              style={{
                fontWeight: 'bold',
                color: '#000',
                fontSize: 18,
                marginVertical: 20,
              }}>
              You haven't uploaded any pdf yet!
            </Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() =>
                navigation.replace('HomeScreen', {screen: 'AddPdf'})
              }>
              <Text style={{color: '#FFF', fontSize: 15, fontWeight: 'bold'}}>
                Upload Now
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MyPdfsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  mainHeading: {
    fontSize: 25,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 20,
  },
  subHeading: {
    fontSize: 12,
    marginHorizontal: 20,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  blockContainer: {
    flex: 1,
    margin: 20,
  },
  block: {
    width: width - 40,
    height: 100,
    backgroundColor: '#FFF',
    elevation: 3,
    flexDirection: 'row',
    marginVertical: 10,
    borderRadius: 10,
  },
  imageContainer: {},
  subImage: {
    width: 120,
    height: 100,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
  infoContainer: {
    margin: 15,
    justifyContent: 'center',
    width: width - 190,
  },
  subName: {
    fontSize: 18,
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  numOfPdf: {
    fontSize: 15,
    justifyContent: 'center',
    opacity: 0.6,
  },
  bookMarkStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readNowButton: {
    backgroundColor: '#2d54ee',
    width: 60,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#07193f',
    height: 40,
    width: 120,
    borderRadius: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
