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
    PanResponder,
    Animated,
    Image,
    TouchableOpacity,
    Navigator,
    TextInput,
    Button,
} from 'react-native';
import MapView from 'react-native-maps';
import {DistancePrioritize,LocToData} from '../Utils'

import ListItem from '../Components/ListItem';

const styles = require( "../../assets/css/style");
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var {height, width} = Dimensions.get('window');
var dataPop = [];
var loaded = false;
var initialPosition = {};
var val = {};
var region: {
        latitude: 34.070286,
        longitude: -118.443413,
        latitudeDelta: 0.0045,
        longitudeDelta: 0.0345,
    };

export default class MainMapView extends Component {

    watchID: ?number = null;

    componentWillMount(){
        this.setupData();
    }

    componentDidMount() {
        setInterval(function(){
            this.setupData();
        }.bind(this), 10000);

        this.setState({
            dataSource: ds.cloneWithRows(dataPop),
            region: {
                latitude: 34.070286,
                longitude: -118.443413,
                latitudeDelta: 0.0045,
                longitudeDelta: 0.0345,
            },
        });
    }

    setupData(){
        this.getData();
        this.getPosition();
    }

    async getData(){
        try {
            let value = await AsyncStorage.getItem('data');
            val = JSON.parse(value);
            if(val !== null){
                this.setState({
                    data: val
                });
                var temp = DistancePrioritize(initialPosition.coords.latitude, initialPosition.coords.longitude, value);
                dataPop = [];
                for(var i = 0; i < temp.length; i++)
                {
                    var locData = {loc:"", dist:0};
                    var distance = Math.round(temp[i].distanceAway);
                    locData.loc = temp[i].location;
                    locData.dist = distance;
                    dataPop.push(locData);
                }
                this.setState({
                    dataSource: ds.cloneWithRows(dataPop)
                });
                loaded = true;
            }
        } catch (e) {
            console.log(e);
        }
    }

    getPosition(){
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var initialPosition2 = JSON.stringify(position);
                var val = JSON.parse(initialPosition2);
                initialPosition = val;
            },
            (error) => alert(JSON.stringify(error)),
            {enableHighAccuracty: true, timeout: 2000000, maximumAge: 500}
        );
        this.watchID = navigator.geolocation.watchPosition((position) => {
            var lastPosition = JSON.stringify(position);
            var val = JSON.parse(lastPosition);
            this.setState({lastPosition: val});
        });
    }

    getInitialState(){
        return{
            region: {
                latitude: 34.070286,
                longitude: -118.443413,
                latitudeDelta: 0.0045,
                longitudeDelta: 0.0345,
            }
        }
    }

    componentWillUnmount(){
        navigator.geolocation.clearWatch(this.watchID);
    }

    constructor(props){
        super(props);
        this.state = {
            data: '',
            dataSource: ds.cloneWithRows(dataPop),
            lastPosition: 'unknown',
            region: {
                latitude: 34.070286,
                longitude: -118.443413,
                latitudeDelta: 0.0045,
                longitudeDelta: 0.0345,
            },
        }
    }

    onRegionChange(region1) {
        this.setState(region: region1);
    }

    gotoDescription(rowData){
        let id = LocToData(rowData.loc, val);
        this.props.navigator.push({
            id: 'Details',
            name: 'More Details',
            rowDat: rowData,
            locID: id,
        });
    }

    renderDragMenu(){
        return (
            <View style={styles.info}>
                {/*
                <View style={{alignItems: 'center', width: width, height: 30, backgroundColor: 'yellow'}}>
                <Image
                     source={require('../../assets/images/handle.png')}/>
                </View>
                */}
                <ListView
                    style={styles.locations}
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) =>
                        <View>
                            <TouchableOpacity onPress={this.gotoDescription.bind(this, rowData)} style={styles.wrapper}>
                                <ListItem imageSrc={require('../../assets/images/icon_ph.png')} rowData={rowData}/>
                            </TouchableOpacity>
                            <View style={styles.separator} />
                        </View>}
                    enableEmptySections={true}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        );
    }

    render() {
        if(loaded && initialPosition != 'unknown'){
            return (
                <View style={styles.container}>
                    <View style={styles.inputWrapper1}>
                        <TextInput
                            style={styles.input}
                            placeholder="Start Destination"
                            underlineColorAndroid="transparent"
                            placeholderTextColor="#adadad"
                        />
                    </View>
                    <View style={styles.inputWrapper2}>
                        <TextInput
                            style={styles.input}
                            placeholder="End Destination"
                            underlineColorAndroid="transparent"
                            placeholderTextColor="#adadad"
                        />
                    </View>
                    <View style={{alignSelf: "stretch"}}>
                        <Button
                            title="Begin Directions"
                        />
                    </View>
                    <MapView style={styles.map}
                        region={this.state.region}
                        >
                        <MapView.Marker
                            image={require('../../assets/images/dot1.png')}
                            coordinate={{
                                latitude: initialPosition.coords.latitude,
                                longitude: initialPosition.coords.longitude,
                                latitudeDelta: 0.0045,
                                longitudeDelta: 0.0345,
                            }}
                        />
                        <MapView.Marker
                            coordinate={{
                                latitude: 34.072872,
                                longitude: -118.441136
                            }}
                            title={"Haines Hall"}
                            description={"Land of Smallberg"}
                        />
                        <MapView.Marker
                            coordinate={{
                                latitude:34.074685,
                                longitude:-118.441416
                            }}
                            color={'#000000'}
                            title={"YRL"}
                            description={"I only go here to work on startup"}
                        />
                    </MapView>
                    {this.renderDragMenu()}
                </View>
            );
        }
        else {
            return (
                <View style={styles.loadMapContainer}>
                    <MapView style={styles.map}
                             region={this.state.region}
                             >
                        <MapView.Marker
                            image={require('../../assets/images/dot1.png')}
                            coordinate={{
                                latitude: 34.070984,
                                longitude: -118.444759,
                                latitudeDelta: 0.0045,
                                longitudeDelta: 0.0345,
                            }}/>
                    </MapView>
                    <View style={styles.info}>
                        <Text style={styles.loadingLocText}>
                            Loading Data...
                        </Text>
                        <Text style={styles.loadingDistText}>
                            We are loading your location data
                        </Text>
                    </View>
                </View>
            );
        }
    }
}
