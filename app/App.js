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
}

//<View style={styles.container}>
//<LoadingView></LoadingView>
//</View>
