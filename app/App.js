import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Navigator,
} from 'react-native';
import MapView from 'react-native-maps';
import LoadingView from './Views/LoadingView';
import MainMapView from'./Views/MainMapView'
const styles = require( "../assets/css/style");

export default class App extends Component {
<<<<<<< HEAD
  render() {
    const { region } = this.props;
    console.log(region);

    return (
      <View style={styles.container}>
        <MapView style={styles.map}
          initialRegion={{
            latitude: 34.0689,
            longitude: -118.4452,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }}>
        </MapView>
          <Text style={styles.description}>
              Description of location is here. Description of location is here. Description of location is here.
              Description of location is here. Description of location is here. Description of location is here.
              Description of location is here.
          </Text>
      </View>
    );
  }
=======
    static get defaultProps(){
        return {
            title: 'Test'
        };
    }

    render() {
        return (
            <Navigator
                initialRoute={{title: 'Test1', index: 0}}
                renderScene={(route, navigator) => {
                    return <LoadingView/>
                }}
            />
        );
    }
>>>>>>> master
}

//<View style={styles.container}>
//<LoadingView></LoadingView>
//</View>
