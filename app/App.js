import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Navigator,
} from 'react-native';
import MapView from 'react-native-maps';
import LoadingView from './Views/LoadingView';
import MainMapView from'./Views/MainMapView';

const styles = require( "../assets/css/style");

export default class App extends Component {

    render() {
        return (
            <Navigator
                initialRoute={{id: 'LoadingView', name: 'Index'}}
                renderScene={this.renderScene.bind(this)}
                configureScene={(route) => {
                    if(route.sceneConfig) {
                        return route.sceneConfig;
                    }
                    return Navigator.SceneConfigs.FloatFromRight;
                }}
            />
        );
    }

    renderScene(route, navigator) {
        var routeID = route.id;
        if(routeID === 'LoadingView') {
            console.log("LoadingView");
            return(
                <LoadingView
                    navigator={navigator}/>
            );
        }
        if(routeID === 'MapView') {
            console.log("MapView");
            return (
                <MainMapView
                    navigator={navigator}/>
            );
        }
    }
}
