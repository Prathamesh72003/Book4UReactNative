import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('window');

const AboutUsScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.orgContainer}>
          <Text style={styles.orgName}>Book4U</Text>
          <Text style={styles.orgDesc}>
            Book4u is an organizaton which servers online pdf's.Our customers
            have access to great pdf's at absolutely FREE OF COST!! We offer a
            beautiful platfrom for students and teachers to easily upload their
            notes/pdfs to keep each other in loop. A new way to get more done,
            spend less time in finding the relevant notes is what we aim.
          </Text>
        </View>
        <View style={styles.devContainer}>
          <Text style={styles.devText}>Meet the Developers</Text>
          <View style={styles.cardContainer}>
            <View style={[styles.card, {marginTop: 40}]}>
              <Image
                style={styles.profileImage}
                source={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/pratham-7dc42.appspot.com/o/about%2Fsiddhesh.jpg?alt=media&token=affae2c6-4f70-499f-a3b9-dfcb2fb4eb42',
                }}
              />

              <View style={styles.infoContainer}>
                <Text style={styles.name} numberOfLines={2}>
                  Siddhesh Shinde
                </Text>
                <Text style={styles.branch} numberOfLines={1}>
                  Computer Engineering
                </Text>
              </View>
            </View>

            <View style={[styles.card, {marginTop: 20}]}>
              <Image
                style={styles.profileImage}
                source={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/pratham-7dc42.appspot.com/o/about%2Fajinkya.jpg?alt=media&token=65f71417-70b8-41cb-8cca-81510481b364',
                }}
              />

              <View style={styles.infoContainer}>
                <Text style={styles.name} numberOfLines={2}>
                  Ajinkya Thambe
                </Text>
                <Text style={styles.branch} numberOfLines={1}>
                  Computer Engineering
                </Text>
              </View>
            </View>

            <View style={[styles.card, {marginTop: 15}]}>
              <Image
                style={styles.profileImage}
                source={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/pratham-7dc42.appspot.com/o/about%2Fsomesh.jpg?alt=media&token=23c70e2a-ec7c-4b45-8151-548a12155dbe',
                }}
              />

              <View style={styles.infoContainer}>
                <Text style={styles.name} numberOfLines={2}>
                  Somesh Somani
                </Text>
                <Text style={styles.branch} numberOfLines={1}>
                  Computer Engineering
                </Text>
              </View>
            </View>

            <View style={[styles.card, {marginTop: -5}]}>
              <Image
                style={styles.profileImage}
                source={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/pratham-7dc42.appspot.com/o/about%2Fprathamesh.jpg?alt=media&token=eef6d093-fb40-43b2-a6c9-b251fce64113',
                }}
              />

              <View style={styles.infoContainer}>
                <Text style={styles.name} numberOfLines={2}>
                  Prathamesh Thakare
                </Text>
                <Text style={styles.branch} numberOfLines={1}>
                  Computer Engineering
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutUsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  orgContainer: {},
  orgName: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2d54ee',
  },
  orgDesc: {
    fontSize: 15,
    color: '#000',
    opacity: 0.7,
  },
  devContainer: {
    marginTop: 20,
  },
  devText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    // marginVertical: 20,
    width: (width - 70) / 2,
    marginRight: 15,
    backgroundColor: '#FFF',
    elevation: 2,
    borderRadius: 10,
    height: 190,
  },
  profileImage: {
    width: (width - 70) / 2,
    height: 120,
    borderRadius: 10,
  },
  infoContainer: {
    padding: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  branch: {
    color: '#000',
    opacity: 0.7,
    fontSize: 13,
  },
});
