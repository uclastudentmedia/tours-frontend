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
    static get defaultProps() {
        return {
            title: 'MapView'
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView style={styles.map}
                         initialRegion={{
            latitude: 34.070286,
            longitude: -118.443413,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.0921,}}>
                    <MapView.Marker
                        image={require('../../assets/images/pin_1x.png')}
                        coordinate={{
            latitude: 34.070286,
            longitude: -118.443413,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.0921,}}
                    />
                </MapView>
                <View style={styles.info}>

                    <Text style={styles.description}>
                        Description of location is here. Description of location is here. Description of location is here.
                        Description of location is here. Description of location is here. Description of location is here.
                        Description of location is here.
                    </Text>
                </View>
            </View>
        );
    }
}
