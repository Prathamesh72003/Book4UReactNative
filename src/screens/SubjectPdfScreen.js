// import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import axios from '../axios/axios';
import LottieView from 'lottie-react-native';

const {width, height} = Dimensions.get('window');

const SubjectPdfScreen = ({navigation, route}) => {
  const [subPdf, setSubPdf] = useState();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  // console.log(route.params.id);
  useEffect(() => {
    axios
      .get('/get_subject_pdf', {params: {id: route.params.id}})
      .then(response => {
        if (response.data == false) {
          setSubPdf([]);
        } else {
          // console.log(response.data);
          setSubPdf(response.data);
        }
        setLoading(false);
      })

      .catch(err => {
        console.log(err);
        ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
        setLoading(false);
      });
    navigation.setOptions({
      title: route.params.name,
    });
  }, []);

  const loadmore = () => {
    let page_update = page + 1;
    setPage(page_update);
    axios
      .get('/get_subject_pdf', {
        params: {id: route.params.id, page: page_update},
      })
      .then(response => {
        if (response.data == false) {
          setPage(-1);
        } else {
          response.data.map(item => {
            setSubPdf(prev => [...prev, item]);
          });
        }
        // subPdf.push(response.data)
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <ActivityIndicator size="large" color="#3f48cc" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {subPdf.length != 0 ? (
        <ScrollView>
          <View style={styles.blockContainer}>
            {subPdf.map((item, index) => {
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
                      <Text style={styles.subName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.numOfPdf} numberOfLines={1}>
                        Total Readers: {item.viewers}
                      </Text>
                      <Text numberOfLines={2} style={styles.description}>
                        {item.description}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
            {page != -1 ? (
              <TouchableOpacity
                onPress={loadmore}
                activeOpacity={0.7}
                style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{textDecorationLine: 'underline', color: 'blue'}}>
                  Load more
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFF',
          }}>
          <LottieView
            source={require('../assets/no_data.json')}
            autoPlay
            loop={false}
            style={{width: 300, height: 300}}
          />
          <Text style={{color: '#000', fontSize: 18, fontWeight: 'bold'}}>
            No PDF found!!
          </Text>
        </View>
      )}
    </View>
  );
};

export default SubjectPdfScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    overflow: "hidden",
    // paddingRight: 10
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
    // overflow: "hidden",
    // alignItems: 'center',
  },
  subName: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  numOfPdf: {
    fontSize: 15,
    opacity: 0.8,
  },
  description: {
    width: width - 180,
    fontSize: 13,
    opacity: 0.6,
  },
});
