import React, {
  StyleSheet,
  Dimensions,
} from 'react-native';

const {height, width} = Dimensions.get('window');

export default StyleSheet.create({
  flexRow: {
    flex: 1,
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    width: width,
    height: width * 0.5,
  },
  contentContainer: {
    padding: 10,
  },
  name: {
    fontSize: 30,
    color: '#5b73a4',
  },
  length: {
    fontSize: 18,
    paddingBottom: 10
  },
  description: {
    paddingTop: 15,
    fontSize: 14,
  },
  header: {
    fontSize: 22,
    padding: 10,
    //color: '#5b73a4',
    borderBottomWidth: 1,
    borderColor: '#dddddd',
  },
  locationBtn: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#dddddd',
    padding: 5,
  },
  categoryIcon: {
    flex: 1,
    height: 25,
    width: 25,
    maxWidth: 25,
    alignSelf: 'center',
  },
  locationText: {
    flex: 1,
    paddingLeft: 15,
    fontSize: 20,
    color: '#5b73a4',
  }
});
