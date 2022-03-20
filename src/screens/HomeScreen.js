import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ImageBackground,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';

import HomeTopBar from '../components/HomeTopBar';
import PdfBlock from '../components/PdfBlock';
import DepartmentBlock from '../components/DepartmentBlock';
import {useNavigation} from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axios from '../axios/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Offline from '../components/Offline';

const {width, height} = Dimensions.get('window');

const CarsolData = [
  {
    id: 1,
    text: 'Read any PDF any time!!!',
    img: require('../assets/tworeaders.png'),
  },
  {
    id: 2,
    text: 'Amazing PDF for free',
    img: require('../assets/free.png'),
  },
  {
    id: 3,
    text: 'Share with your friends',
    img: require('../assets/share.png'),
  },
];

const HomeScreen = ({navigation, route}) => {
  const [search, setSearch] = useState('');
  const [pdfData, setPdfData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [user, setUser] = useState();

  const _carousel = useRef();
  // const navigation = useNavigation();
  useEffect(async () => {
    if (Offline() == false) {
      navigation.replace('HomeScreen', {screen: 'Orders'});
    }
    const user_data = await AsyncStorage.getItem('user');
    const user_json = JSON.parse(user_data);
    // console.log(user_json.department_id);
    setUser(JSON.parse(user_data));

    getRecomendation(user_json);

    getDepartmentdata();

    navigation.setOptions({
      headerTextAlign: 'left',
      headerTitle: () => <HomeTopBar />,
      headerLeft: false,
    });
  }, []);

  const getRecomendation = user_json => {
    axios
      .get('/get_recommendations', {
        params: {department_id: user_json.department_id},
      })
      .then(response => {
        setPdfData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };
  const getDepartmentdata = () => {
    axios
      .get('/department_wise_pdf_count')
      .then(response => {
        setDepartmentData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };
  const searchFun = () => {
    if (search.length > 0) {
      setSearch("");
      navigation.navigate('SearchResult', {search: search});
    } else {
      ToastAndroid.show('Empty search', ToastAndroid.SHORT);
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.topContainer}>
          <View style={styles.searchBarContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search here..."
              value={search}
              onChangeText={text => setSearch(text)}
              placeholderTextColor={'#878787'}
            />
            <TouchableOpacity onPress={searchFun}>
              <FontAwesome5
                style={{marginLeft: 10}}
                name="search"
                size={20}
                color={'#000'}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.corosalContainer}>
            <Carousel
              ref={_carousel}
              autoplay={true}
              loop={true}
              autoplayDelay={4000}
              data={CarsolData}
              renderItem={({item, index}) => {
                return (
                  <View style={styles.corosal} key={index}>
                    <Image style={styles.imageCorosal} source={item.img} />
                    <Text style={styles.textCorosal}>{item.text}</Text>
                  </View>
                );
              }}
              sliderWidth={width * 0.9}
              itemWidth={width * 0.9}
            />
          </View>
        </View>
        <Text style={styles.title}>PDF's 4 you</Text>
        <View style={styles.card1}>
          {pdfData.length == 0 ? (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator size="large" color="#3f48cc" />
            </View>
          ) : (
            <FlatList
              data={pdfData}
              horizontal={true}
              renderItem={({item}) => {
                // console.log(item.id);
                return (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() =>
                      navigation.navigate('Detail', {id: item.id})
                    }>
                    <PdfBlock
                      name={item.name}
                      subject={item.subject_name}
                      img={item.img_url.toString()}
                    />
                  </TouchableOpacity>
                );
              }}
              keyExtractor={item => item.id}
            />
          )}
        </View>
        <Text style={styles.departmentTitle}>Departments</Text>
        <View style={styles.card2}>
          {departmentData.length == 0 ? (
            <View
              style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
              <ActivityIndicator size="large" color="#3f48cc" />
            </View>
          ) : (
            departmentData.map((item, index) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  key={index}
                  onPress={() =>
                    navigation.navigate('Subjects', {
                      id: item.department_id,
                      name: item.department_name,
                    })
                  }>
                  <DepartmentBlock
                    key={index}
                    img={item.url}
                    name={item.department_name}
                    total={item.count}
                    department_id={item.department_id}
                  />
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  topContainer: {
    height: height * 0.35,
    backgroundColor: '#3f48cc',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 20,
    marginBottom: 10,
  },
  searchBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 30,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  searchInput: {
    flexGrow: 1,
    paddingVertical: 5,
    fontWeight: 'bold',
    color: '#000',
    fontWeight: '500',
  },
  corosalContainer: {
    marginTop: 20,
  },
  corosal: {
    marginRight: 20,
    width: width * 0.9,
    height: height * 0.2,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  imageCorosal: {
    position: 'absolute',
    zIndex: -10,
    // left:
    right: 5,
    top: 0,
    width: width * 0.4,
    height: height * 0.2,
    borderRadius: 20,
    resizeMode: 'contain',
  },
  textCorosal: {
    padding: 10,
    paddingHorizontal: 15,
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    width: '80%',
  },
  title: {
    // fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  card1: {
    height: 240,
    // backgroundColor: '#fff',
    // flexWrap: 'wrap',
    // elevation: 10,
    // borderRadius: 10,
    width: width - 30,
    // padding: 20,
    marginHorizontal: 15,
  },
  departmentTitle: {
    marginTop: 0,
    fontSize: 22,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  card2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // width: 10,
    padding: 15,
  },
});
