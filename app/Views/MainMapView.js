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
    TouchableOpacity,
    TextInput,
} from 'react-native';

import { debounce } from 'lodash';

import MapView from 'react-native-maps';
import SearchBar from 'react-native-searchbar';

import {
  DistancePrioritize,
  popPrioritize,
  LocToData,
  LocToIcon
} from 'app/Utils';

import { GetLandmarkList } from 'app/DataManager';
import {popLocation} from 'app/LocationPopManager'

const styles = require( "../../assets/css/style");

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

var initialPosition = {coords: {latitude: 34.070286, longitude: -118.443413}};
var mapSettinger='popular';
var val = {};
let flag1 = {latitude: 0, longitude: 0};
var flag2 = {latitude: 0, longitude: 0};
var initCoords = {};
var route = [ ];
var serverRoute = {};
var serverRouteChecked = false;
let tbt = false;

export default class MainMapView extends Component {


    constructor(props){
        super(props);

        this.watchID = null;
        this.dataSourceTBT = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.initialRegion = {
          latitude: 34.070286,
          longitude: -118.443413,
          latitudeDelta: 0.0045,
          longitudeDelta: 0.0345,
        };

        this.state = {
            markers: [],
            region: this.initialRegion,
            results: []
        };
        this._handleResults = this._handleResults.bind(this);
        this.onRegionChange = debounce(this.onRegionChange.bind(this), 100);
    }

    componentDidMount() {

        this.getPosition();

        this.getData()
            .then(() => this.updateMapIcons())
            .catch(console.error);
    }

    async getData() {
        this.landmarks = await GetLandmarkList();
    }

    componentWillUnmount(){
        navigator.geolocation.clearWatch(this.watchID);
    }

    updateMapIcons() {
        var val = this.landmarks;
        if(!val) {
          return;
        }

        var temp;

        switch (mapSettinger) {
          case 'tour':
            //if map setting is tours, display locations on the tour
            break;

          case 'distance':
            //if map setting is nearby, prioritize top 10 location by distance

            break;

          case 'popular':
          default:
            //if map setting is campus map. prioritize top 10 locations by popularity/category
            //this is default
            temp = popPrioritize(val,
                                 this.state.region.latitude,
                                 this.state.region.longitude,
                                 this.state.region.latitudeDelta,
                                 this.state.region.longitudeDelta,"All");
            break;
        }

        var dataPop = [];
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
            markersData.srcID= specLoc.category_id;
            markersData.location=temp[i].location;
            markersData.id = temp[i].id;
            markersTemp.push(markersData);
        }
        markersTemp.splice(0,1);
        markersTemp.slice(0,10);
        this.setState({
            markers:markersTemp
        });
    }

    getPosition(){
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var initialPosition2 = JSON.stringify(position);
                var val = JSON.parse(initialPosition2);
                initialPosition = val;
                this.setState({lastPosition: val});
            },
            (error) => alert(JSON.stringify(error)),
            {enableHighAccuracy: true, timeout: 2000000, maximumAge: 500}
        );
        this.watchID = navigator.geolocation.watchPosition((position) => {
            var lastPosition = JSON.stringify(position);
            var val = JSON.parse(lastPosition);
            this.setState({lastPosition: val});
        });
    }

    _handleResults(results) {
        this.setState({ results });
    }

    onRegionChange(region) {
      this.setState({ region:region });
      this.updateMapIcons();
    }

    changeMapSetting(setting){
        mapSettinger=setting;
        this.updateMapIcons();
    }

    //function to switch to descriptions view
    gotoDescription(rowData){
        let id = LocToData(rowData.loc, this.landmarks);
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
            console.error(e);
        }
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
        });
        this.dataSourceTBT.cloneWithRows(serverRoute.trip.legs[0].maneuvers),
        tbt = true;
    }

    render() {
        if(!(Object.keys(serverRoute).length === 0 && serverRoute.constructor === Object) && !serverRouteChecked)
        {
            this.extractRoute();
        }

        let polyline = null;
        if (tbt != true) {
          polyline = (
            <MapView.Polyline
              coordinates={route}
              strokeWidth={3}
            />
          );
        }

        return (
            <View style={styles.container}>
                <SearchBar
                    ref={(ref) => this.searchBar = ref}
                    handleResults={this._handleResults}
                    autoCorrect
                    showOnLoad
                    focusOnLayout={false}
                    hideBack={true}
                />
                <MapView style={styles.map}
                    initialRegion={this.state.region}
                    zoomEnabled
                    onRegionChange={this.onRegionChange}
                    >
                    <MapView.Marker
                        image={require('../../assets/images/dot1.png')}
                        coordinate={initialPosition.coords}
                    />

                    {polyline}

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
            </View>
        );
    }
}

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
