import React, {
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';

const {height, width} = Dimensions.get('window');

export default StyleSheet.create({
  statusBar: {
    paddingTop: Platform.select({
      android: 10,
      ios: 20,
    }),
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    position: 'absolute',
    backgroundColor: '#f89406',
    width: width,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    elevation: 10,
    zIndex: 10,
    padding: 10,
  },
  disabled: {
    backgroundColor: '#888',
  },
  btn: {
    flex: 7,
    borderRadius: 5,
    height: 30,
    margin: 5,
    backgroundColor: '#f8bc06',
  },
  btnUnderlayColor: {
    backgroundColor: '#ab8204'
  },
  btnIcon: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    flex: 1,
    color: 'white',
    marginTop: 5,
    marginLeft: 10,
    fontSize: 17,
  },
  goBtn: {
    backgroundColor: '#43A047',
    borderColor: '#ffffff',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goBtnUnderlayColor: {
    backgroundColor: '#2c6a2f',
  },
  goText: {
    fontSize: 28,
    color: 'white',
    marginLeft: 10,
  },
  container: {
    marginTop: 200,
    alignItems: 'center',
  },
  errorText: {
    color: '#d61414',
    fontSize: 22,
  },
  helpHeader: {
    fontWeight: 'bold',
    fontSize: 28,
    margin: 10
  },
  helpBody: {
    fontSize: 16,
    padding: 10
  },
});
