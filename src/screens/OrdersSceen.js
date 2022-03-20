import React, {useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Linking,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import RNFetchBlob from 'rn-fetch-blob';
import fs from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../axios/axios';
import LottieView from 'lottie-react-native';
import getThumbnail from '../components/Thumbnail';

const {width, height} = Dimensions.get('window');

const subs = [
  {
    id: 1,
    name: 'Python',
    nop: 50,
    date: '10 Sept',
  },
  {
    id: 2,
    name: 'React',
    nop: 50,
    date: '10 Sept',
  },
  {
    id: 3,
    name: 'CPP',
    nop: 50,
    date: '10 Sept',
  },
  {
    id: 4,
    name: 'JAVA',
    nop: 50,
    date: '10 Sept',
  },
];

const SubjectPdfScreen = ({navigation}) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [downloads, setDownloads] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(async () => {
    getDownloads();
  }, []);

  const openPdf = (name, url) => {
    const {dirs} = RNFetchBlob.fs;
    const path = `${fs.DocumentDirectoryPath}/.book4u/` + url;
    navigation.navigate('ReadPdf', {
      name: name,
      url: path,
      type: 'file',
    });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getDownloads();
    setRefreshing(false);
  }, []);

  const getDownloads = async () => {
    const user_data = await AsyncStorage.getItem('user');
    const user_json = JSON.parse(user_data);
    setDownloads([]);
    const {dirs} = RNFetchBlob.fs;
    RNFetchBlob.fs
      .ls(`${fs.DocumentDirectoryPath}/.book4u`)
      .then(files => {
        if (files.length == 0) setLoading(false);
        files.map(async item => {
          let name = item.split('.');
          let img_url = await getThumbnail(
            `${fs.DocumentDirectoryPath}/.book4u/` + item,
          );
          // console.log(
          //   'content://' + `${fs.DocumentDirectoryPath}/.book4u/` + item,
          // );
          setDownloads(prev => [
            ...prev,
            {
              name: name[0],
              url: item,
              img_url: img_url,
            },
          ]);
          setLoading(false);
        });
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
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
      <Text style={styles.mainHeading}>Downloads</Text>
      <Text style={styles.subHeading}>Last 30 days orders</Text>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {downloads.length != 0 ? (
          <View style={styles.blockContainer}>
            {downloads.map((item, index) => {
              return (
                <View style={styles.block} key={index}>
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

                    <View style={styles.bookMarkStyle}>
                      <Text numberOfLines={1}></Text>
                      <TouchableOpacity
                        style={styles.readNowButton}
                        onPress={() => openPdf(item.name, item.url)}>
                        <FontAwesome5
                          name="arrow-right"
                          size={20}
                          color={'#fff'}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              // flexGrow: 1,
              height: height - 70,
              // backgroundColor: '#000',
              // marginTop: 20,
            }}>
            <LottieView
              source={require('../assets/no_bookmark.json')}
              autoPlay
              loop={false}
              style={{width: 300, height: 300}}
            />
            <Text style={{fontWeight: 'bold', color: '#000', fontSize: 18}}>
              No downloads found!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SubjectPdfScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    height: 70,
    backgroundColor: '#FFF',
    elevation: 3,
    flexDirection: 'row',
    marginVertical: 10,
    borderRadius: 10,
    // flexDirection: 'row',
  },
  imageContainer: {
    width: 120,
    height: 100,
    // backgroundColor: '#000',
  },
  subImage: {
    width: 110,
    height: 70,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    resizeMode: 'contain',
  },
  infoContainer: {
    margin: 8,
    justifyContent: 'space-between',
    width: width - 190,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subName: {
    fontSize: 18,
    textTransform: 'capitalize',
    fontWeight: 'bold',
    width: width - 250,
  },
  numOfPdf: {},
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
});
