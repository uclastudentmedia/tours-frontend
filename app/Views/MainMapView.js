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
} from 'react-native';
import MapView from 'react-native-maps';
import {DistancePrioritize,popPrioritize,LocToData,LocToIcon} from '../Utils'

import ListItem from '../Components/ListItem';

const styles = require( "../../assets/css/style");
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var {height, width} = Dimensions.get('window');
var dataPop = [];
var loaded = false;
var initialPosition = {};
var mapSetting=1;
//var icon = this.props.active ? require('./my-icon-active.png') : require('./my-icon-inactive.png');
var imgsourcestuff='../../assets/images/icon_ph.png';
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
                var temp;
                if(mapSetting===2){
                    //if map setting is tours, display locations on the tour
                }
                else if(mapSetting===0){
                    //if map setting is nearby, prioritize top 10 location by distance
                    temp = DistancePrioritize(initialPosition.coords.latitude, initialPosition.coords.longitude, value);
                }
                else{
                    //if map setting is campus map. prioritize top 10 locations by popularity/category
                    //this is default
                    temp = popPrioritize(value,initialPosition.coords.latitude, initialPosition.coords.longitude,
                        0.0545,0.0145);
                }
                //temp = DistancePrioritize(initialPosition.coords.latitude, initialPosition.coords.longitude, value).slice(0,10);
                dataPop = [];
                for(var i = 0; i < temp.length; i++)
                {
                    //push location data onto data
                    var locData = {loc:"", dist:0,icon_src:""};
                    var distance = Math.round(temp[i].distanceAway);
                    locData.loc = temp[i].location;
                    locData.dist = distance;
                    locData.imSrc=temp[i].imgSrc;
                    dataPop.push(locData);

                    //push coordinate data into this.markers
                    var markersData = {lat:0,long:0,src:""};
                    markersData.lat= temp[i].lat;
                    markersData.long= temp[i].long;
                    //console.log("markers category: " + temp[i].category);
                    markersData.src=temp[i].imgSrc;
                    this.state.markers.push(markersData);
                }
                this.state.markers.slice(0,10);
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
            markers:[{lat:34.070286,long:-118.443413,src:""}],
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
//'../../assets/images/icon_ph.png'

    renderDragMenu(){
        return (
            <View style={styles.info}>
                <View style={{alignItems: 'center', width: width, height: 30, backgroundColor: 'yellow'}}>
                <Image
                    source={require('../../assets/images/handle.png')}/>
                </View>
                <ListView
                    style={styles.locations}
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) =>
                        <View>
                            <TouchableOpacity onPress={this.gotoDescription.bind(this, rowData)} style={styles.wrapper}>
                                <ListItem imageSrc={{uri:'../../assets/images/icon_ph.png'}} rowData={rowData}/>
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
                            image={require('../../assets/images/dot1.png')}
                            coordinate={{
                                latitude: initialPosition.coords.latitude+(0.0045/2),
                                longitude: initialPosition.coords.longitude-(0.0345/2),
                                latitudeDelta: 0.0045,
                                longitudeDelta: 0.0345,
                            }}
                        />
                        <MapView.Marker
                            image={require('../../assets/images/dot1.png')}
                            coordinate={{
                                latitude: initialPosition.coords.latitude-(0.0045/2),
                                longitude: initialPosition.coords.longitude+(0.0345/2),
                                latitudeDelta: 0.0045,
                                longitudeDelta: 0.0345,
                            }}
                        />
                        {this.state.markers.map(marker => (
                            <MapView.Marker
                                coordinate={{
                                    latitude:marker.lat,
                                    longitude:marker.long,
                                }}
                                title={marker.title}
                                description={marker.description}
                            />
                        ))}
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
