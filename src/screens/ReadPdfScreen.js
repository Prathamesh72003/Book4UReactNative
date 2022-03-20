import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import PDFView from 'react-native-view-pdf';

// const resources = {
//   file:
//     Platform.OS === 'ios'
//       ? 'downloadedDocument.pdf'
//       : '/sdcard/Download/downloadedDocument.pdf',
//   url: 'http://www.africau.edu/images/default/sample.pdf',
//   base64: 'JVBERi0xLjMKJcfs...',
// };

const ReadPdfScreen = ({navigation, route}) => {
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [total, setTotal] = useState(0);
  // const resourceType = 'url';
  // console.log(route.params.url);
  useEffect(() => {
    navigation.setOptions({
      title: route.params.name,
    });
  }, []);
  return (
    <View style={{flex: 1}}>
      {loading == true ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={'large'} color={'#000'} />
        </View>
      ) : null}
      {/* Some Controls to change PDF resource */}
      <PDFView
        fadeInDuration={250.0}
        style={{flex: 1}}
        resource={route.params.url}
        resourceType={route.params.type}
        onLoad={() => {
          setLoading(false);
        }}
        onPageChanged={(active, total) => {
          // console.log('active: ' + active + ' ,total: ' + total);
          setTotal(total);

          setActive(active + 1);
        }}
        onError={error => {
          console.log('Cannot render PDF', error);
          setLoading(false);
          ToastAndroid.show(
            'Something went wrong, Please try again!',
            ToastAndroid.SHORT,
          );
        }}
      />
      <View style={styles.pagination}>
        <View style={styles.paginationContainer}>
          <Text style={styles.pageNumber}>
            {active} / {total}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ReadPdfScreen;

const styles = StyleSheet.create({
  pagination: {
    // position: 'absolute',
    bottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    // flex: 1,
  },
  paginationContainer: {
    width: 50,
    height: 25,
    borderRadius: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageNumber: {
    color: '#FFF',
  },
});
