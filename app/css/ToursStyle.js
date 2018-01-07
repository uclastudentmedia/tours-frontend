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
  listItemContainer: {
    flex: 1,
    width: width,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  nameText: {
    margin: 10,
    fontSize: 26,
    //fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowRadius: 10,
    textShadowOffset: {width: 1, height: 1},
    backgroundColor: 'transparent',
  },
});
