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
} from 'react-native';
import axios from '../axios/axios';
const {width, height} = Dimensions.get('window');
import LottieView from 'lottie-react-native';

const SearchResult = ({navigation, route}) => {
  const [resPdf, setResPdf] = useState();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    axios
      .get('/search', {params: {search: route.params.search}})
      .then(response => {
        setResPdf(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
        setLoading(false);
      });
    navigation.setOptions({
      title: route.params.search,
    });
  }, []);

  const loadmore = () => {
    let page_update = page + 1;
    setPage(page_update);
    axios
      .get('/search', {
        params: {search: route.params.search, page: page_update},
      })
      .then(response => {
        if (response.data.length == 0) {
          setPage(-1);
        } else {
          response.data.map(item => {
            setResPdf(prev => [...prev, item]);
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
        <LottieView
          source={require('../assets/search.json')}
          autoPlay
          style={{width: 300, height: 300}}
          loop
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {resPdf.length != 0 ? (
        <ScrollView>
          <View style={styles.blockContainer}>
            {resPdf.map((item, index) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  key={index}
                  onPress={() => navigation.navigate('Detail', {id: item.id})}>
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
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <LottieView
            source={require('../assets/not_found.json')}
            autoPlay
            loop={false}
            style={{width: 300, height: 300}}
          />
          <Text style={{fontWeight: 'bold', color: '#000', fontSize: 18}}>
            No Result found
          </Text>
        </View>
      )}
    </View>
  );
};

export default SearchResult;

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
  },
  subName: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  numOfPdf: {
    fontSize: 15,
    opacity: 0.7,
    paddingVertical: 2,
  },
  description: {
    width: width - 180,
    opacity: 0.6,
    fontSize: 14,
  },
});
