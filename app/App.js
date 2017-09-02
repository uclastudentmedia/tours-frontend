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
import LocationListView from './Views/LocationListView';
import DetailsView from './Views/DetailsView';


const styles = require( "../assets/css/style");

export default class App extends Component {

    render() {
        return (
            <Navigator
                initialRoute={{id: 'LoadingView', name: 'Index'}}
                renderScene={this.renderScene1.bind(this)}
                configureScene={(route) => {
                    if(route.sceneConfig) {
                        return route.sceneConfig;
                    }
                    return Navigator.SceneConfigs.FloatFromRight;
                }}
            />
        );
    }

    renderScene1(route, navigator) {
        var routeID = route.id;
        if(routeID === 'LoadingView') {
            console.log("LoadingView");
            return(
                <LoadingView
                    navigator={navigator}/>
            );
        } else if (routeID === 'MapView') {
            console.log("MapView");
            return (
                <MainMapView
                    navigator={navigator}/>
            );
        } else if (routeID === 'Details') {
            console.log("Details");
            return (
                <DetailsView
                    navigator={navigator}
                    rowData={route.rowDat}
                    detID={route.locID}
                    lastLoc={route.lastPos}
                />
            );
        } else if (routeID === 'LocationListView') {
            console.log("LocationListView");
            console.log(route.locations)
            return (
                <LocationListView
                    navigator={navigator}
                    locations={route.locations}
                />
            );
        }
    }
}
