import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axios from '../axios/axios';

const FeedbackScreen = () => {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [userId, setUserId] = useState('613f8323c9fad3ccf92f1c0a');

  const postFeddback = () => {
    if (rating > 0 && message.length > 0) {
      const data = {
        user_id: userId,
        feedback: message,
        rating: rating,
      };
      console.log(data);
      axios
        .post('/post_feedback', data)
        .then(response => {
          ToastAndroid.show(
            'Feedback submitted successfully',
            ToastAndroid.LONG,
          );
          console.log(response.data);
          setRating(0);
          setMessage('');
        })
        .catch(error => {
          console.error('s' + error);
        });
    } else {
      ToastAndroid.show('All fields are required', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainHeading}>We'd love to hear from you!</Text>

      <View style={styles.emojiContainer}>
        <TouchableOpacity style={styles.emoji} onPress={() => setRating(5)}>
          <FontAwesome5
            name="grin-hearts"
            size={35}
            color={rating == 5 ? '#2d54ee' : '#000'}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.emoji} onPress={() => setRating(4)}>
          <FontAwesome5
            name="smile-beam"
            size={35}
            color={rating == 4 ? '#2d54ee' : '#000'}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.emoji} onPress={() => setRating(3)}>
          <FontAwesome5
            name="smile"
            size={35}
            color={rating == 3 ? '#2d54ee' : '#000'}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.emoji} onPress={() => setRating(2)}>
          <FontAwesome5
            name="frown"
            size={35}
            color={rating == 2 ? '#2d54ee' : '#000'}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.emoji} onPress={() => setRating(1)}>
          <FontAwesome5
            name="sad-tear"
            size={35}
            color={rating == 1 ? '#2d54ee' : '#000'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.messageContainer}>
        <TextInput
          style={styles.messageInput}
          value={message}
          //   numberOfLines={4}
          multiline={true}
          onChangeText={text => setMessage(text)}
          placeholder="Type here..."
          placeholderTextColor={'grey'}
        />
      </View>
      <View style={styles.sendButtonContainer}>
        <TouchableOpacity style={styles.sendButton} onPress={postFeddback}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    //   justifyContent: "center"
  },
  mainHeading: {
    fontSize: 28,
    marginBottom: 50,
    fontWeight: 'bold',
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    elevation: 5,
    padding: 10,
    borderRadius: 10,
  },
  emoji: {},
  messageContainer: {
    marginVertical: 30,
    height: 200,
    borderWidth: 1,
    borderRadius: 10,
    padding: 2,
  },
  messageInput: {
    justifyContent: 'flex-start',
    color: '#000',
  },
  sendButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: '#2d54ee',
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  sendText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
