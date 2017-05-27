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

import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation'

const styles = require( "../../assets/css/style");
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

const IMAGES = {
  image1: require('../../assets/loc_icons/1.png'), // statically analyzed
  image2: require('../../assets/loc_icons/2.png'), // statically analyzed
  image3: require('../../assets/loc_icons/3.png'), // statically analyzed
  image4: require('../../assets/loc_icons/4.png'), // statically analyzed
  image5: require('../../assets/loc_icons/5.png'), // statically analyzed
  image6: require('../../assets/loc_icons/6.png'), // statically analyzed
  image7: require('../../assets/loc_icons/7.png'), // statically analyzed
  image8: require('../../assets/loc_icons/8.png'), // statically analyzed
  image9: require('../../assets/loc_icons/9.png'), // statically analyzed
  image10: require('../../assets/loc_icons/10.png'), // statically analyzed
  image11: require('../../assets/loc_icons/11.png'), // statically analyzed
  image12: require('../../assets/loc_icons/12.png'), // statically analyzed
  image13: require('../../assets/loc_icons/13.png'), // statically analyzed
  image14: require('../../assets/loc_icons/14.png'), // statically analyzed
  image15: require('../../assets/loc_icons/15.png'), // statically analyzed
  image16: require('../../assets/loc_icons/17.png'), // statically analyzed
  image18: require('../../assets/loc_icons/18.png'), // statically analyzed
  image20: require('../../assets/loc_icons/20.png'), // statically analyzed
  image61: require('../../assets/loc_icons/61.png'), // statically analyzed
  image321: require('../../assets/loc_icons/321.png'), // statically analyzed
  image961: require('../../assets/loc_icons/961.png'), // statically analyzed
  image1285: require('../../assets/loc_icons/1285.png'), // statically analyzed
}

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
            viewIDG: 2,
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
                console.log("BREAK");
                markersTemp=[[{lat:34.070286,long:-118.443413,src:""}]];
                for(var i = 0; i < temp.length; i++)
                {
                    //push location data onto data
                    var locData = {loc:"", dist:0,catID:1};
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
                        locData.catID = specLoc.category_id - 1000;
                    }
                    dataPop.push(locData);

                    //push coordinate data into this.markers
                    var markersData = {title:'',lat:0,long:0,srcID:1};
                    markersData.title = temp[i].location;
                    markersData.lat= temp[i].lat;
                    markersData.long= temp[i].long;
                    //console.log("markers category: " + temp[i].category);
                    markersData.srcID= specLoc.category_id - 1000;
                    markersData.location=temp[i].location;
                    markersTemp.push(markersData);
                }
                markersTemp.splice(0,1);
                markersTemp.slice(0,10);
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

    gotoView(viewID){
        switch(viewID)
        {
          case 0:
            this.setState({viewIDG: 0});
            break;
          case 1:
            this.setState({viewIDG: 1});
            break;
          case 2:
            this.setState({viewIDG: 2});
            break;
          case 3:
            this.setState({viewIDG: 3});
            break;
          case 4:
            this.setState({viewIDG: 4});
            break;
        }
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
            viewIDG: 2,
        }
    }

    onRegionChange(region1) {
        this.setState({ region:region1 });
        this.getData();
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
                    "lon": location.long,
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

    renderGlobalNav(){
        return(
            <BottomNavigation
                labelColor="grey"
                style={{ height: 56, elevation: 8, position: 'absolute', left: 0, bottom: 0, right: 0 }}
                onTabChange={(newTabIndex) => this.gotoView(newTabIndex)}
                activeTab={this.state.viewIDG}
            >
                <Tab
                    barBackgroundColor="white"
                    label="Maps"
                    icon={<MaterialsIcon size={24} color="#CCCCCC" name="tv" />}
                />
                <Tab
                    barBackgroundColor="white"
                    label="Tours"
                    icon={<MaterialsIcon size={24} color="#CCCCCC" name="music-note" />}
                />
                <Tab
                    barBackgroundColor="white"
                    label="Schedule"
                    icon={<MaterialsIcon size={24} color="#CCCCCC" name="music-note" />}
                />
                <Tab
                    barBackgroundColor="white"
                    label="Favorites"
                    icon={<MaterialsIcon size={24} color="#CCCCCC" name="book" />}
                />
                <Tab
                    barBackgroundColor="white"
                    label="Nearby"
                    icon={<MaterialsIcon size={24} color="#CCCCCC" name="account-box" />}
                />
            </BottomNavigation>
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
                              image={require('../../assets/new_sizes/1.png')}
                            />
                          )
                      )}
                    </MapView>
                    <SlidingUpPanel
                        containerMaximumHeight={deviceHeight - 100}
                        handlerBackgroundColor={'rgba(0,0,0,0)'}
                        handlerHeight={33}
                        allowStayMiddle={true}
                        handlerDefaultView={<HandlerOne/>}>
                            {this.renderDragMenu()}
                     </SlidingUpPanel>
                     {this.renderGlobalNav()}
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
