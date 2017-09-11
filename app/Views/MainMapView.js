'use strict';

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
  popPrioritize,
  LocToData,
} from 'app/Utils';

import {
  GetLocationList,
  GetLocationById,
} from 'app/DataManager';

import {popLocation} from 'app/LocationPopManager'

import { GetIcon, dot1 } from 'app/Assets';

import { styles, CustomMapStyle } from 'app/css';

var mapSettinger='popular';
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

        this.GPSManager = props.screenProps.GPSManager;

        this.dataSourceTBT = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.landmarks = GetLocationList();

        this.initialPosition = {
          latitude: 34.070286,
          longitude: -118.443413,
        };

        this.initialRegion = {
          latitude: 34.070286,
          longitude: -118.443413,
          latitudeDelta: 0.0045,
          longitudeDelta: 0.0345,
        };

        this.state = {
            position: this.initialPosition,
            markers: [],
            region: this.initialRegion,
            results: []
        };
        this._handleResults = this._handleResults.bind(this);
        this.onRegionChange = debounce(this.onRegionChange.bind(this), 100);
    }

    componentDidMount() {
        // get position
        this.watchID = this.GPSManager.watchPosition(() => {
          this.setState({
            position: this.GPSManager.getPosition()
          });
        });

        this.updateMapIcons();
    }

    componentWillUnmount(){
        this.GPSManager.clearWatch(this.watchID);
    }

    updateMapIcons() {
        if(!this.landmarks) {
          return;
        }

        var temp = [];

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
            temp = popPrioritize(this.state.region.latitude,
                                 this.state.region.longitude,
                                 this.state.region.latitudeDelta,
                                 this.state.region.longitudeDelta,
                                 "Food & Beverage");
            break;
        }

        var markersTemp = [];
        for(var i = 0; i < temp.length; i++)
        {
            //push location data onto data
            var locData = {loc:"", dist:0,catID:1};
            var distance = Math.round(temp[i].distanceAway);
            locData.loc = temp[i].location;
            locData.dist = distance;
            var specLoc = GetLocationById(temp[i].id);
            if (specLoc && specLoc.category_id)
            {
                locData.catID = specLoc.category_id;
            }

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
        markersTemp.slice(0,10);

        // add the selected location if needed
        const selected = this.state.selectedLocation;
        if (selected && !markersTemp.find(l => l.id == selected.id)) {
          console.log(selected);
          markersTemp.push({
            title: selected.name,
            lat: selected.lat,
            long: selected.long,
            srcID: selected.category_id,
            location: selected.name,
            id: selected.id,
          });
        }

        this.setState({
            markers:markersTemp
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

//    async search(text) {
//        try
//        {
//            let tochirisukun = await AsyncStorage.getItem('data');
//            val = JSON.parse(tochirisukun);
//            text = text.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
//            let location = LocToData(text, val);
//
//            let rowan = {
//                "locations": [{
//                    "lat": location.lat,
//                    "lon": location.long,
//                }, {
//                    "lat": initialPosition.coords.latitude,
//                    "lon": initialPosition.coords.longitude,
//                }],
//                "costing": "pedestrian",
//                "directions_options": {
//                    "units": "miles"
//                }
//            };
//
//            initCoords.latitude = location.lat;
//            initCoords.longitude = location.long;
//
//            let angelrooroo = {};
//
//            console.log("https://tours.bruinmobile.com/route?json=" + JSON.stringify(rowan));
//            fetch("https://tours.bruinmobile.com/route?json=" + JSON.stringify(rowan))
//              .then((response) => response.json())
//              .then((responseJson) => {
//                  angelrooroo = responseJson;
//                  serverRoute = responseJson;
//                  serverRouteChecked = false;
//              })
//              .catch((error) => {
//                console.error(error);
//              });
//        }
//        catch (e)
//        {
//            console.error(e);
//        }
//    }

    decode(str, precision) {
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
    }

    extractRoute(){
        serverRouteChecked = true;

        let ply = serverRoute.trip.legs[0].shape;

        console.log(ply);

        let troute = this.decode(ply);
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

        flag1.latitude = this.initialPosition.latitude;
        flag1.longitude = this.initialPosition.longitude;

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

    // marker deselected
    onPressMap = () => {
      this.setState({
        selectedLocation: undefined,
      });
    }

    // marker selected
    onPressMarker = (id) => {
      return (event) => {
        this.setState({
          selectedLocation: GetLocationById(id),
        })
      };
    }

    // TODO: this should work when Daniel's branch is merged
    onCalloutPress = (id) => {
      return (event) => {
        const location = GetLocationById(id);
        console.log(location);

        this.props.navigation.navigate('Details', {
            id: 'Details',
            title: location.name,
            location: location,
        });
      };
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
                    provider="google"
                    initialRegion={this.initialRegion}
                    zoomEnabled
                    onRegionChange={this.onRegionChange}
                    customMapStyle={CustomMapStyle}
                    onPress={this.onPressMap}
                    >
                    <MapView.Marker
                        image={dot1}
                        coordinate={this.initialPosition}
                    />

                    {polyline}

                    {this.state.markers.map(marker => (
                        <MapView.Marker
                          key={marker.id}
                          coordinate={{latitude: marker.lat, longitude: marker.long}}
                          title={marker.title}
                          description={marker.description}
                          image={GetIcon(marker.srcID)}
                          onPress={this.onPressMarker(marker.id)}
                          onCalloutPress={this.onCalloutPress(marker.id)}
                        />
                      )
                    )}

                </MapView>
            </View>
        );
    }
}

