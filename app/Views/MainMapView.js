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
import TBTItem from '../Components/TBTItem';
import SlidingUpPanel from 'react-native-sliding-up-panel';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import { Kohana } from 'react-native-textinput-effects';
import RNAnimatedTabs from 'rn-animated-tabs';
import TabNavigator from 'react-native-animated-tabbar';
import { Container, Navbar } from 'navbar-native';
import SearchBar from 'react-native-searchbar';

import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation'

const styles = require( "../../assets/css/style");
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const dsTBT = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

const MAPIMAGES = {
  image1: require('../../assets/new_sizes/1.png'), // statically analyzed
  image2: require('../../assets/new_sizes/2.png'), // statically analyzed
  image3: require('../../assets/new_sizes/3.png'), // statically analyzed
  image4: require('../../assets/new_sizes/4.png'), // statically analyzed
 // image5: require('../../assets/new_sizes/5.png'), // statically analyzed
  image6: require('../../assets/new_sizes/6.png'), // statically analyzed
  image7: require('../../assets/new_sizes/7.png'), // statically analyzed
  image8: require('../../assets/new_sizes/8.png'), // statically analyzed
  image9: require('../../assets/new_sizes/9.png'), // statically analyzed
  image10: require('../../assets/new_sizes/10.png'), // statically analyzed
  image11: require('../../assets/new_sizes/11.png'), // statically analyzed
  image12: require('../../assets/new_sizes/12.png'), // statically analyzed
  image13: require('../../assets/new_sizes/13.png'), // statically analyzed
  image14: require('../../assets/new_sizes/14.png'), // statically analyzed
  image15: require('../../assets/new_sizes/15.png'), // statically analyzed
  image16: require('../../assets/new_sizes/17.png'), // statically analyzed
  image18: require('../../assets/new_sizes/18.png'), // statically analyzed
  image20: require('../../assets/new_sizes/20.png'), // statically analyzed
  image61: require('../../assets/new_sizes/61.png'), // statically analyzed
  image321: require('../../assets/new_sizes/321.png'), // statically analyzed
  image961: require('../../assets/new_sizes/961.png'), // statically analyzed
  image1285: require('../../assets/new_sizes/1285.png'), // statically analyzed
}

var {height, width} = Dimensions.get('window');
var dataPop = [];
var loaded = false;
var initialPosition = {coords: {latitude: 34.070286, longitude: -118.443413}};
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
let tbt = false;

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
        var val = null;
        try {
            let value = await AsyncStorage.getItem('data');
            val = JSON.parse(value);
        } catch (e) {
            console.log(e);
        }
        if(val !== null){
            //console.log("initialposition",initialPosition);
            //console.log("region",this.state.region);
            var temp;
            if(mapSettinger===2){
                //if map setting is tours, display locations on the tour
            }
            else if(mapSettinger===0){
                //if map setting is nearby, prioritize top 10 location by distance
                temp = DistancePrioritize(initialPosition.coords.latitude, initialPosition.coords.longitude, val);
            }
            else{
                //if map setting is campus map. prioritize top 10 locations by popularity/category
                //this is default
                temp = popPrioritize(val,this.state.region.latitude, this.state.region.longitude,
                    this.state.region.latitudeDelta, this.state.region.longitudeDelta);
                //console.log("region",this.state.region);
            }
            //temp = DistancePrioritize(initialPosition.coords.latitude, initialPosition.coords.longitude, val).slice(0,10);
            dataPop = [];
            markersTemp=[[{lat:34.070286,long:-118.443413,src:""}]];
            for(var i = 0; i < temp.length; i++)
            {
                //push location data onto data
                var locData = {loc:"", dist:0,catID:1};
                var distance = Math.round(temp[i].distanceAway);
                locData.loc = temp[i].location;
                locData.dist = distance;
                var specLoc = LocToData(locData.loc, val);
                if (specLoc && specLoc.category_id)
                {
                    locData.catID = specLoc.category_id;
                }
                dataPop.push(locData);

                //push coordinate data into this.markers
                var markersData = {title:'',lat:0,long:0,srcID:1};
                markersData.title = temp[i].location;
                markersData.lat= temp[i].lat;
                markersData.long= temp[i].long;
                //console.log("markers category: " + temp[i].category);
                markersData.srcID= locData.catID;
                markersData.location=temp[i].location;
                markersData.id = temp[i].id;
                markersTemp.push(markersData);
            }
            markersTemp.splice(0,1);
            markersTemp.slice(0,10);
            this.setState({
                data: val,
                dataSource: ds.cloneWithRows(dataPop),
                markers:markersTemp
            });
            loaded = true;
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
            dataSourceTBT: dsTBT.cloneWithRows(dataPop),
            lastPosition: 'unknown',
            region: {
                latitude: 34.070286,
                longitude: -118.443413,
                latitudeDelta: 0.0045,
                longitudeDelta: 0.0345,
            },
            viewIDG: 2,
            bTBT: [],
            results: []
        };
        this._handleResults = this._handleResults.bind(this);
    }

    handleTabChange = (value) => this.setState({ currentTab: value });

    _handleResults(results) {
        this.setState({ results });
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
        let id = LocToData(rowData.loc, this.state.data);
        this.props.navigator.push({
            id: 'Details',
            name: 'More Details',
            rowDat: rowData,
            locID: id,
        });
    }

    async search(text) {
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
                "costing": "pedestrian",
                "directions_options": {
                    "units": "miles"
                }
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
             }],
             dataSourceTBT: dsTBT.cloneWithRows(serverRoute.trip.legs[0].maneuvers),
        });
        tbt = true;
    }

    render() {
        if(loaded && initialPosition != 'unknown' && tbt != true){
            if(!(Object.keys(serverRoute).length === 0 && serverRoute.constructor === Object) && !serverRouteChecked)
            {
                    this.extractRoute();
            }
            return (
                <View style={styles.container}>
                    <SearchBar
                        ref={(ref) => this.searchBar = ref}
                        handleResults={this._handleResults}
                        autoCorrect
                    />
                    <Container>
                        <Navbar
                            bgColor={"white"}
                            user={true}
                            title={
                                    <Text>      UCLA Tours</Text>
                            }
                            titleColor={"grey"}
                            left={{
                                icon: "md-menu",
                                iconColor: "#CCCCCC"
                            }}
                            right={{
                                icon: "md-search",
                                iconColor: "#CCCCCC",
                                onPress: () => {this.searchBar.show()}
                            }}
                            style={styles.navbar}
                        />
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
                                  key={marker.id}
                                  coordinate={{latitude: marker.lat, longitude: marker.long}}
                                  title={marker.title}
                                  description={marker.description}
                                  image={MAPIMAGES['image' + marker.srcID]}
                                />
                              )
                          )}
                        </MapView>
                        <View style={styles.slideContainer}>
                            <SlidingUpPanel
                                containerMaximumHeight={deviceHeight - 120}
                                handlerBackgroundColor={'rgba(0,0,0,0)'}
                                handlerHeight={33}
                                allowStayMiddle={true}
                                handlerDefaultView={<HandlerOne/>}>
                                    {this.renderDragMenu()}
                             </SlidingUpPanel>
                         </View>
                         {this.renderGlobalNav()}
                    </Container>
                </View>
            );
        }
        else if(loaded && tbt == true){
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
                        <ListView
                            style={styles.locations}
                            dataSource={this.state.dataSourceTBT}
                            renderRow={(rowData) =>
                                <View>
                                    <TouchableOpacity style={styles.wrapper}>
                                        <TBTItem rowData={rowData}/>
                                        </TouchableOpacity>
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
