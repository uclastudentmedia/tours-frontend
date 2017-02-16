/**
 * Created by Daniel on 2/9/2017.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    ListView,
    Dimensions,
    Image
} from 'react-native';
import MapView from 'react-native-maps';

import LoadingView from './LoadingView';

const styles = require( "../../assets/css/style");
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var {height, width} = Dimensions.get('window');
var dataPop = [];

export default class MainMapView extends Component {

    watchID: ?number = null;

    async componentWillMount(){
        this.getPosition();

        try {
            let value = await AsyncStorage.getItem('data');
            let val = JSON.parse(value);
            if(val !== null){
                this.setState({
                    data: val
                });

                var temp = val.results;
                for(var i = 0; i < 10; i++)
                {
                    dataPop.push(temp[i].name);
                }
                this.setState({
                    dataSource: ds.cloneWithRows(dataPop)
                });
                this.setState({
                    loaded: true
                });
            }
        } catch (e) {
            console.log(e);
        }

    }

    getPosition(){
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var initialPosition = JSON.stringify(position);
                var val = JSON.parse(initialPosition);
                this.setState({initialPosition: val});
            },
            (error) => alert(JSON.stringify(error)),
            {enableHighAccuracty: true, timeout: 20000, maximumAge: 1000}
        );
        this.watchID = navigator.geolocation.watchPosition((position) => {
            var lastPosition = JSON.stringify(position);
            var val = JSON.parse(lastPosition);
            this.setState({lastPosition: val});
        });
    }

    componentWillUnmount(){
        navigator.geolocation.clearWatch(this.watchID);
    }

    constructor(props){
        super(props);
        this.state = {
            data: '',
            dataSource: ds.cloneWithRows(dataPop),
            loaded: false,
            initialPosition: 'unknown',
            lastPosition: 'unknown',
        }
    }

    async DistancePrioritize(currentLat,currentLong){
        try {
            const value = await AsyncStorage.getItem('data');
            if (value !== null){
                // We have data!!
                let val = JSON.parse(value);

                var DistAway = [];
                for(var i = 0; i<val.results.length; i++){
                    DistAway.push({
                        location:val.results[i].name,
                        distanceAway: this.DistanceCalc(currentLat,currentLong,val.results[i].lat,val.results[i].long)
                    });
                }
                DistAway.sort(function(a,b){
                    if(a.distanceAway<b.distanceAway){
                        return -1;
                    }
                    if(a.distanceAway>b.distanceAway){
                        return 1;
                    }
                    return 0;
                });
                return DistAway.slice(0,10);
            }
        } catch (error) {
            // Error retrieving data
            console.log(error.message)
        }
    }

    //calculates distance between two lat long points and returns the distance apart in feet
    DistanceCalc([lat1, lon1], [lat2, lon2]){
        // haversine :: (Num, Num) -> (Num, Num) -> Num
        let haversine = ([lat1, lon1], [lat2, lon2]) => {
            // Math lib function names
            let [pi, asin, sin, cos, sqrt, pow, round] =
                    ['PI', 'asin', 'sin', 'cos', 'sqrt', 'pow', 'round']
                        .map(k => Math[k]),

            // degrees as radians
                [rlat1, rlat2, rlon1, rlon2] = [lat1, lat2, lon1, lon2]
                    .map(x => x / 180 * pi),

                dLat = rlat2 - rlat1,
                dLon = rlon2 - rlon1,
                radius = 6372.8; // km

            // km
            return round(
                    radius * 2 * asin(
                        sqrt(
                            pow(sin(dLat / 2), 2) +
                            pow(sin(dLon / 2), 2) *
                            cos(rlat1) * cos(rlat2)
                        )
                    ) * 100
                ) / 100;
        };

        // Return in feet (converts km to ft)
        function FeetConverter(km){return km * 3280.84;}
        return FeetConverter(haversine(
            [lat1,lon1],
            [lat2,lon2]
        ));
    }

    static get defaultProps() {
        return {
            title: 'MapView',
        };
    }

    render() {
        if(this.state.loaded && this.state.initialPosition != 'unknown'){
            let val2 = DistancePrioritize(this.state.initialPosition.coords.latitude, this.state.initialPosition.coords.longitude);
            console.log(val2);

            return (
                <View style={styles.container}>
                    <MapView style={styles.map}
                             initialRegion={{
                latitude: 34.070286,
                longitude: -118.443413,
                latitudeDelta: 0.0122,
                longitudeDelta: 0.0921,}}>
                        <MapView.Marker
                            image={require('../../assets/images/pin_80.png')}
                            coordinate={{
                latitude: this.state.initialPosition.coords.latitude,
                longitude: this.state.initialPosition.coords.longitude,
                latitudeDelta: 0.0122,
                longitudeDelta: 0.0921,}}
                        />
                    </MapView>
                    <View style={styles.info}>

                        <ListView
                            style={styles.locations}
                            dataSource={this.state.dataSource}
                            renderRow={(rowData) => <Text style={styles.locText}>{rowData}</Text>}
                            enableEmptySections={true}
                        />
                    </View>
                </View>
            );
        }
        else {
            return (
                <LoadingView/>
            );
        }
    }
}
