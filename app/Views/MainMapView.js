'use strict';

/**
 * Created by Daniel on 2/9/2017.
 */
import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    TextInput,
} from 'react-native';

import PubSub from 'pubsub-js';
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

import GPSManager from 'app/GPSManager';

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
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        screenProps: PropTypes.shape({
            GPSManager: PropTypes.instanceOf(GPSManager).isRequired,
        }),
    };

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
          latitude: 34.0700086,
          longitude: -118.446003,
          latitudeDelta: 0.03,
          longitudeDelta: 0.02,
        };

        this.state = {
            position: this.initialPosition,
            markerLocations: [],
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

        var markerLocations = [];

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
            markerLocations = popPrioritize(this.state.region,
                                            'All');
                                            //'Food & Beverage');
            break;
        }

        // limit the number of markers
        markerLocations = markerLocations.slice(0, 10);

        // add the selected location if needed
        const selected = this.state.selectedLocation;
        if (selected && !markerLocations.find(l => l.id == selected.id)) {
            console.log(selected);
            markerLocations.push(selected);
        }

        this.setState({
            markerLocations: markerLocations
        });
    }

    _handleResults(results) {
        this.setState({ results });
    }

    onRegionChange(region) {
      this.setState({ region:region });
      PubSub.publish('MainMapView.onRegionChange', region);
      this.updateMapIcons();
    }

    changeMapSetting(setting){
        mapSettinger=setting;
        this.updateMapIcons();
    }

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
    onPressMarker = (location) => {
      return (event) => {
        this.setState({
          selectedLocation: location,
        })
      };
    }

    onCalloutPress = (location) => {
      return (event) => {
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
                    customMapStyle={CustomMapStyle}
                    initialRegion={this.initialRegion}
                    zoomEnabled
                    onRegionChange={this.onRegionChange}
                    onPress={this.onPressMap}
                    >
                    <MapView.Marker
                        image={dot1}
                        coordinate={this.initialPosition}
                    />

                    {polyline}

                    {this.state.markerLocations.map(loc => (
                        <MapView.Marker
                          key={loc.id}
                          coordinate={{latitude: loc.lat, longitude: loc.long}}
                          title={loc.name}
                          //description={loc.text_description}
                          image={GetIcon(loc.category_id)}
                          onPress={this.onPressMarker(loc)}
                          onCalloutPress={this.onCalloutPress(loc)}
                        />
                      )
                    )}

                </MapView>
            </View>
        );
    }
}

