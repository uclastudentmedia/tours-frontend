import React, {
  StyleSheet,
  Dimensions,
} from 'react-native';

const {height, width} = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: width,
    height: height,
  },
  image: {
    width: width,
    height: width * 0.75,
  },
  contentContainer: {
    padding: 10,
  },
  name: {
    fontSize: 26,
    color: '#222',
  },
  length: {

  },
  description: {

  },
  header: {

  },
});
