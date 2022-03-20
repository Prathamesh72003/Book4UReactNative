import React, {useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  ToastAndroid,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from '../axios/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

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
  const [bookmarkData, setBookmarkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [refreshing, setRefreshing] = useState(false);
  useEffect(async () => {
    getBookmarks();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getBookmarks();
    setRefreshing(false);
  }, []);

  const getBookmarks = async () => {
    // setLoading(true);
    // console.log(user);
    const user_data = await AsyncStorage.getItem('user');
    const user_json = JSON.parse(user_data);
    axios
      .get('/get_bookmarks', {
        params: {
          user_id: user_json.id,
        },
      })
      .then(response => {
        setBookmarkData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainHeading}>Bookmarks</Text>
      <ScrollView
        style={{flex: 1}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {loading ? (
          <View
            style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <ActivityIndicator size={'large'} color="#3f48cc" />
          </View>
        ) : bookmarkData.length != 0 ? (
          <View style={styles.blockContainer}>
            {bookmarkData.map((item, index) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  key={index}
                  onPress={() => navigation.navigate('Detail', {id: item._id})}>
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
                      <View style={styles.bookMarkStyle}>
                        <Text style={styles.subName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <MaterialIcons
                          name="bookmark"
                          size={20}
                          color={'#000'}
                        />
                      </View>
                      <Text style={styles.numOfPdf} numberOfLines={1}>
                        Total Readers: {item.viewers}
                      </Text>
                      <Text
                        numberOfLines={2}
                        style={{fontSize: 10, opacity: 0.6}}>
                        Description: {item.description}
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
              flex: 1,
              height: height - 80,
              // marginTop: 20,
            }}>
            <LottieView
              source={require('../assets/no_bookmark.json')}
              autoPlay
              loop={false}
              style={{width: 300, height: 300}}
            />
            <Text style={{fontWeight: 'bold', color: '#000', fontSize: 18}}>
              No Bookmarks to show!
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
    backgroundColor: '#fff',
  },
  mainHeading: {
    fontSize: 25,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 20,
  },
  blockContainer: {
    flex: 1,
    margin: 20,
  },
  block: {
    width: width - 40,
    height: 100,
    backgroundColor: '#fff',
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
    justifyContent: 'space-between',
    width: width - 190,
  },
  subName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  numOfPdf: {
    marginVertical: 5,
    opacity: 0.7,
  },
  bookMarkStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
