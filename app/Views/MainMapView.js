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
            latitude: 34.070286,
            longitude: -118.443413,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,}}>
                    <MapView.Marker draggable
                                    coordinate={this.state.x}
                                    onDragEnd={(e) => this.setState({ x: e.nativeEvent.coordinate })}
                    />
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
