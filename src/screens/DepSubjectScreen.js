import React, {useState, useEffect} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from '../axios/axios';
import LottieView from 'lottie-react-native';

const {width, height} = Dimensions.get('window');

const subs = [
  {
    id: 1,
    name: 'Python',
    nop: 50,
  },
  {
    id: 2,
    name: 'React',
    nop: 50,
  },
  {
    id: 3,
    name: 'CPP',
    nop: 50,
  },
  {
    id: 4,
    name: 'JAVA',
    nop: 50,
  },
];

const DepSubjectScreen = ({navigation, route}) => {
  const [depSubject, setDepSubject] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  // console.log(route.params);
  useEffect(() => {
    axios
      .get('/get_department_subject', {params: {id: route.params.id}})
      .then(response => {
        // console.log(response.data);
        setDepSubject(response.data);
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
      .get('/get_department_subject', {
        params: {id: route.params.id, page: page_update},
      })
      .then(response => {
        if (response.data.length == 0) {
          setPage(-1);
        } else {
          response.data.map(item => {
            setDepSubject(prev => [...prev, item]);
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
      {depSubject.length != 0 ? (
        <ScrollView>
          <View style={styles.blockContainer}>
            {depSubject.map((item, index) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  key={index}
                  onPress={() =>
                    navigation.navigate('Pdf', {id: item.id, name: item.name})
                  }>
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
                        Number of PDF's: {item.count}
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
            No subject found!!
          </Text>
        </View>
      )}
    </View>
  );
};

export default DepSubjectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "grey",
  },

  blockContainer: {
    padding: 20,
    // backgroundColor: 'greys',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  block: {
    elevation: 5,
    width: (width - 60) / 2,
    backgroundColor: '#FFF',
    marginBottom: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },

  imageContainer: {},

  subImage: {
    width: (width - 60) / 2,
    height: 150,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },

  infoContainer: {
    paddingHorizontal: 5,
    paddingVertical: 10,
  },

  subName: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  numOfPdf: {
    fontSize: 14,
    opacity: 0.7,
  },
});
