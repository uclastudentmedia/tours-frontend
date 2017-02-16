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
import {DistancePrioritize} from '../Utils'

import LoadingView from './LoadingView';

const styles = require( "../../assets/css/style");
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var {height, width} = Dimensions.get('window');
var dataPop = [];
var test = ['a','b'];

export default class MainMapView extends Component {

    watchID: ?number = null;

    async componentWillMount(){
        this.getPosition();
    }

    async componentDidMount(){
        try {
            let value = await AsyncStorage.getItem('data');
            let val = JSON.parse(value);
            //let val2 = DistancePrioritize(this.state.initialPosition.coords.latitude, this.state.initialPosition.coords.longitude);
            //console.log("ADFADFAF");
            //console.log(val2);
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

    static get defaultProps() {
        return {
            title: 'MapView',
        };
    }

    render() {
        if(!this.state.loaded){
            let val2 = DistancePrioritize(34.070381, -118.443497);
            //console.log("ADFADFAF");
            console.log(val2);
            return (
                <LoadingView/>
            );
        }
        else if(this.state.loaded && this.state.initialPosition != 'unknown'){
            //insert DistancePrioritize(lat,long) function here
            //console.log(DistancePrioritize(1,0));
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

                        <ListView
                            style={{width: width - 40}}
                            dataSource={this.state.dataSource}
                            renderRow={(rowData) => <Text>{rowData}</Text>}
                            enableEmptySections={true}
                        />
                    </View>
                </View>
            );
        }
    }
}
