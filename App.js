import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
import DepSubjectScreen from './src/screens/DepSubjectScreen';
import SubjectPdfScreen from './src/screens/SubjectPdfScreen';
import BookMarkScreen from './src/screens/BookMarkScreen';
import OrdersSceen from './src/screens/OrdersSceen';
import ProfileScreen from './src/screens/ProfileScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import FeedbackScreen from './src/screens/FeedbackScreen';
import AboutUsScreen from './src/screens/AboutUsScreen';
import FirstScreen from './src/screens/FirstScreen';
import AddPdfScreen from './src/screens/AddPdfScreen';
import ReadPdfScreen from './src/screens/ReadPdfScreen';
import MyPdfsScreen from './src/screens/MyPdfsScreen';
import SearchResultScreen from './src/screens/SearchResult';

const Tab = createBottomTabNavigator();
const CustomTabBarButton = ({children, onPress}) => (
  <TouchableOpacity
    activeOpacity={0.9}
    style={{
      top: -20,
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={onPress}>
    <View
      style={{
        width: 60,
        height: 60,
        borderRadius: 35,
        backgroundColor: '#0440ca',
      }}>
      {children}
    </View>
  </TouchableOpacity>
);

const TabNavi = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        activeTintColor: '#3f48cc',

        keyboardHidesTabBar: true,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color}) => {
            return <FontAwesome5 name="home" size={22} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Bookmark"
        component={BookMarkScreen}
        options={{
          tabBarIcon: ({color}) => {
            return <FontAwesome5 name="bookmark" size={22} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="AddPdf"
        component={AddPdfScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <FontAwesome5
              name="plus"
              size={22}
              color={focused ? '#FFF' : '#f2f2f2'}
            />
          ),
          tabBarButton: props => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersSceen}
        options={{
          tabBarIcon: ({color}) => {
            return (
              <FontAwesome5 name="file-download" size={22} color={color} />
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color}) => {
            return <FontAwesome5 name="user" size={22} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          options={{headerShown: false}}
          name="Splash"
          component={SplashScreen}
        />

        <Stack.Screen
          options={{headerShown: false}}
          name="First"
          component={FirstScreen}
        />

        <Stack.Screen
          options={{headerShown: false}}
          name="SignUp"
          component={SignUpScreen}
        />

        <Stack.Screen
          options={{headerShown: false}}
          name="Login"
          component={LoginScreen}
        />

        {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
        <Stack.Screen
          options={{headerShown: false}}
          name="HomeScreen"
          component={TabNavi}
        />

        <Stack.Screen
          name="SearchResult"
          options={{
            headerStyle: {
              backgroundColor: '#07193f',
            },
            headerTintColor: '#fff',
          }}
          component={SearchResultScreen}
        />

        <Stack.Screen
          options={{headerShown: false}}
          name="Detail"
          component={DetailScreen}
        />

        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: '#07193f',
            },
            headerTintColor: '#fff',
            headerShown: true,
          }}
          name="Subjects"
          component={DepSubjectScreen}
        />
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: '#07193f',
            },
            headerTintColor: '#fff',
            headerShown: true,
          }}
          name="Pdf"
          component={SubjectPdfScreen}
        />
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: '#07193f',
            },
            headerTintColor: '#fff',
            headerShown: true,
          }}
          name="EditProfile"
          component={EditProfileScreen}
        />
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: '#07193f',
            },
            headerTintColor: '#fff',
            headerShown: true,
          }}
          name="Feedback"
          component={FeedbackScreen}
        />
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: '#07193f',
            },
            headerTintColor: '#fff',
            headerShown: true,
          }}
          name="AboutUs"
          component={AboutUsScreen}
        />
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: '#07193f',
            },
            headerTintColor: '#fff',
            headerShown: true,
          }}
          name="ReadPdf"
          component={ReadPdfScreen}
        />
        <Stack.Screen
          options={{headerShown: true}}
          name="MyPdfs"
          component={MyPdfsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
