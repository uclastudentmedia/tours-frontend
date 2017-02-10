/**
 * Created by Daniel on 2/9/2017.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import MapView from 'react-native-maps';
const styles = require( "../../assets/css/style");

export default class MainMapView extends Component {
    render() {
        return (
            <View style={styles.container}>
                <MapView style={styles.map}
                         initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
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
}
