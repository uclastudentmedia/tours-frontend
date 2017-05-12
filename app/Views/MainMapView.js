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
import {DistancePrioritize,popPrioritize,LocToData,LocToIcon} from '../Utils'
import ListItem from '../Components/ListItem';
import SlidingUpPanel from 'react-native-sliding-up-panel';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import { Kohana } from 'react-native-textinput-effects';


const styles = require( "../../assets/css/style");
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var {height, width} = Dimensions.get('window');
var dataPop = [];
var loaded = false;
var initialPosition = {};
var mapSettinger=1;
var val = {};
var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;
var region: {
    latitude: 34.070286,
    longitude: -118.443413,
    latitudeDelta: 0.0045,
    longitudeDelta: 0.0345,
};
let flag1 = {latitude: 0, longitude: 0};
var flag2 = {latitude: 0, longitude: 0};
var initCoords = {};
var route = [ ];
var serverRoute = {};
var serverRouteChecked = false;

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
                //console.log("initialposition",initialPosition);
                //console.log("region",this.state.region);
                this.setState({
                    data: val
                });
                var temp;
                if(mapSettinger===2){
                    //if map setting is tours, display locations on the tour
                }
                else if(mapSettinger===0){
                    //if map setting is nearby, prioritize top 10 location by distance
                    temp = DistancePrioritize(initialPosition.coords.latitude, initialPosition.coords.longitude, value);
                }
                else{
                    //if map setting is campus map. prioritize top 10 locations by popularity/category
                    //this is default
                    temp = popPrioritize(value,this.state.region.latitude, this.state.region.longitude,
                        this.state.region.latitudeDelta, this.state.region.longitudeDelta);
                    //console.log("region",this.state.region);
                }
                //temp = DistancePrioritize(initialPosition.coords.latitude, initialPosition.coords.longitude, value).slice(0,10);
                dataPop = [];
                markersTemp=[[{lat:34.070286,long:-118.443413,src:""}]];
                for(var i = 0; i < temp.length; i++)
                {
                    //push location data onto data
                    var locData = {loc:"", dist:0,icon_src:""};
                    var distance = Math.round(temp[i].distanceAway);
                    locData.loc = temp[i].location;
                    locData.dist = distance;
                    var specLoc = LocToData(locData.loc, val);
                    if(specLoc.category_id == null)
                    {
                        locData.catID = 1;
                    }
                    else
                    {
                        locData.catID = specLoc.category_id;
                    }
                    locData.imSrc=temp[i].imgSrc;
                    dataPop.push(locData);

                    //push coordinate data into this.markers
                    var markersData = {lat:0,long:0,src:""};
                    markersData.lat= temp[i].lat;
                    markersData.long= temp[i].long;
                    //console.log("markers category: " + temp[i].category);
                    markersData.src=temp[i].imgSrc;
                    markersData.location=temp[i].location;
                    markersTemp.push(markersData);
                }
                markersTemp.splice(0,1);
                markersTemp.slice(0,10);
                //console.log(markersTemp);
                this.setState({
                    dataSource: ds.cloneWithRows(dataPop),
                    markers:markersTemp
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
            markers: [],
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
        this.setState({ region:region1 });
        //this.getData();
    }
    changeMapSetting(setting){
        mapSettinger=setting;
        this.getData();
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

    async search(text)
    {
        try
        {
            let tochirisukun = await AsyncStorage.getItem('data');
            val = JSON.parse(tochirisukun);
            text = text.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
            let location = LocToData(text, val);

            let rowan = {
                "locations": [{
                    "lat": location.lat,
//                    "lat": 34.071749,
                    "lon": location.long,
//                    "lon": -118.442166,
                }, {
                    "lat": initialPosition.coords.latitude,
                    "lon": initialPosition.coords.longitude,
                }],
                "costing": "pedestrian"
            };

            initCoords.latitude = location.lat;
            initCoords.longitude = location.long;

            let angelrooroo = {};

            console.log("https://tours.bruinmobile.com/route?json=" + JSON.stringify(rowan));
            fetch("https://tours.bruinmobile.com/route?json=" + JSON.stringify(rowan))
              .then((response) => response.json())
              .then((responseJson) => {
                  angelrooroo = responseJson;
                  serverRoute = responseJson;
                  serverRouteChecked = false;
              })
              .catch((error) => {
                console.error(error);
              });
        }
        catch (e)
        {
            console.log(e);
        }
    }

    renderDragMenu(){
        return (
            <View style={styles.info}>
                <ListView
                    style={styles.locations}
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) =>
                        <View>
                            <TouchableOpacity onPress={this.gotoDescription.bind(this, rowData)} style={styles.wrapper}>
                                <ListItem rowData={rowData}/>
                            </TouchableOpacity>
                            <View style={styles.separator} />
                        </View>}
                    enableEmptySections={true}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        );
    }

    extractRoute(){
        console.log("EXTRACTED");
        serverRouteChecked = true;

        let ply = serverRoute.trip.legs[0].shape;

        console.log(ply);

        let troute = decode(ply);
        route = [];
        for(var i = 0; i < troute.length; i++)
        {
            let temp1 = troute[i][0];
            let temp2 = troute[i][1];

            route.push({
                latitude: temp1,
                longitude: temp2
            });
        }

        flag1.latitude = initialPosition.coords.latitude;
        flag1.longitude = initialPosition.coords.longitude;

        flag2.latitude = initCoords.latitude;
        flag2.longitude = initCoords.longitude;

        this.setState({
            markers: [{
                lat: flag1.latitude,
                long: flag1.longitude
             },
             {
                 lat: flag2.latitude,
                 long: flag2.longitude
             }]
        });
    }

    render() {
        if(loaded && initialPosition != 'unknown'){
            if(!(Object.keys(serverRoute).length === 0 && serverRoute.constructor === Object) && !serverRouteChecked)
            {
                    this.extractRoute();
            }
            return (
                <View style={styles.container}>
                    <View style={styles.inputWrapper1}>
                    {/*
                        <TextInput
                            style={styles.input}
                            placeholder="Start Destination"
                            underlineColorAndroid="transparent"
                            placeholderTextColor="#adadad"
                        />
                    */}
                      <Kohana
                        style={{ backgroundColor: '#6495ed' }}
                        label={'Tap to Search'}
                        iconClass={MaterialsIcon}
                        iconName={'search'}
                        iconColor={'white'}
                        labelStyle={{ color: 'white' }}
                        inputStyle={{ color: 'white' }}
                        onSubmitEditing={(event) => this.search(event.nativeEvent.text)}
                      />
                    </View>
                    <View style={styles.btnContainer}>
                        <Button
                            onPress={()=>this.changeMapSetting(0)}
                            title="Nearby"
                            accessibilityLabel="Learn more about this purple button"
                            style={styles.button}
                        />
                        <Button
                            onPress={()=>this.changeMapSetting(1)}
                            title="Campus"
                            accessibilityLabel="Learn more about this purple button"
                            style={styles.button}
                        />
                        <Button
                            onPress={()=>this.changeMapSetting(2)}
                            title="Tours"
                            accessibilityLabel="Learn more about this purple button"
                            style={styles.button}
                        />
                    </View>
                    <MapView style={styles.map}
                        region={this.state.region}
                         zoomEnabled
                             onRegionChangeComplete={(region) => this.setState({ region })}
                             onRegionChange={this.onRegionChange.bind(this)}
                        >
                        <MapView.Marker
                            image={require('../../assets/images/dot1.png')}
                            coordinate={{
                                latitude: initialPosition.coords.latitude,
                                longitude: initialPosition.coords.longitude
                            }}
                        />
                        <MapView.Polyline
                            coordinates={route}
                            strokeWidth={3}
                        />
                        {this.state.markers.map(marker => (
                            <MapView.Marker
                              coordinate={{latitude: marker.lat, longitude: marker.long}}
                              title={marker.title}
                              description={marker.description}
                            />
                          ))}
                    </MapView>
                    <SlidingUpPanel
                        containerMaximumHeight={deviceHeight - 100}
                        handlerBackgroundColor={'rgba(0,0,0,0)'}
                        handlerHeight={33}
                        allowStayMiddle={true}
                        handlerDefaultView={<HandlerOne/>}>
                            {this.renderDragMenu()}
                     </SlidingUpPanel>
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
                                longitude: -118.444759
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

class HandlerOne extends Component{
    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.image} source={require('../../assets/images/drag_bar.png')}>
                    </Image>
            </View>
        );
    }
};

decode = function(str, precision) {
    var index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, precision || 6);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
};
