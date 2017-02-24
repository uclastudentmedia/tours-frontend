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
    TouchableHighlight,
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

export default class MainMapView extends Component {

    watchID: ?number = null;

    componentDidMount(){
        this.setupData();
        setInterval(function(){
            this.setupData();
        }.bind(this), 10000);
    }

    setupData(){
        this.getData();
        this.getPosition();
    }

    async getData(){
        try {
            let value = await AsyncStorage.getItem('data');
            let val = JSON.parse(value);
            if(val !== null){
                this.setState({
                    data: val
                });

                var temp = DistancePrioritize(this.state.initialPosition.coords.latitude, this.state.initialPosition.coords.longitude, value);
                for(var i = 0; i < temp.length; i++)
                {
                    var locData = {loc:"", dist:0};
                    var distance = Math.round(temp[i].distanceAway);
                    locData.loc = temp[i].location;
                    locData.dist = distance;
                    //dataPop.push(temp[i].location + '\n' + dist + " feet away");
                    dataPop.push(locData);
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
                            renderRow={(rowData) =>
                                <View>
                                    <View style={styles.wrapper}>
                                        <Image style={styles.placeholder} source={require('../../assets/images/icon_ph.png')}/>
                                        <Text style={styles.locText}>
                                            {rowData.loc}{'\n'}
                                            <Text style={styles.distText}>
                                                {rowData.dist} feet away
                                            </Text>
                                        </Text>
                                    </View>
                                    <View style={styles.separator} />
                                </View>}
                            enableEmptySections={true}
                            showsVerticalScrollIndicator={false}
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
