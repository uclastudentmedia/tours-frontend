'use strict';

/**
 * Created by Daniel on 2/9/2017.
 */
import React, { Component, PropTypes } from 'react';
import {
    View,
    ListView,
    TouchableWithoutFeedback,
    TouchableOpacity,
} from 'react-native';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';

import PubSub from 'pubsub-js';
import { debounce } from 'lodash';

import MapView from 'react-native-maps';

import {
  popPrioritize,
} from 'app/Utils';

import {
  GetLocationList,
  GetLocationById,
} from 'app/DataManager';

import { Location } from 'app/DataTypes';

import GPSManager from 'app/GPSManager';

import {popLocation} from 'app/LocationPopManager'

import { GetIcon, dot1 } from 'app/Assets';

import { styles, CustomMapStyle } from 'app/css';

// how the locations are prioritized
var mapSettinger='popular';

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

        this.locations = GetLocationList();

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
            results: [],
            route: {}
        };
        this._handleResults = this._handleResults.bind(this);
        this.onRegionChange = debounce(this.onRegionChange.bind(this), 100);

        this.markerRefs = {};
        this.specialMarkerLocations = []; // for route start/end, details, etc.

        this.subscribe();
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

    subscribe() {

      PubSub.subscribe('DirectionsView.showRouteOnMap', (msg, route) => {
        const {
          startLocation,
          endLocation,
          polyline,
        } = route;

        this.specialMarkerLocations = [startLocation, endLocation];
        this.updateMapIcons();

        this.setState({ polyline: polyline });

        this.mapView.fitToCoordinates(polyline, {
          edgePadding: { top: 400, left: 200, right: 200, bottom: 200 }
        });
      });

      PubSub.subscribe('DirectionsView.clearRoute', () => {
        this.setState({
          polyline: null
        });
        this.specialMarkerLocations = [];
        this.updateMapIcons();
      });


      PubSub.subscribe('DetailsView.showLocationOnMap', (msg, location) => {
        this.specialMarkerLocations = [location];
        this.updateMapIcons();

        this.mapView.animateToRegion({
          latitude: location.lat,
          longitude: location.long,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 1000);
        this.markerRefs[location.id].showCallout();
      });
    }

    zoomToCurrentLocation = () => {
        this.mapView.animateToRegion({
          latitude: this.state.position.latitude,
          longitude: this.state.position.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 500);
    }

    openSearchMenu = () => {
        const {
          navigation
        } = this.props;

        navigation.navigate('Search', {
          onResultSelect: loc => navigation.navigate('Details', {
            location: loc
          }),
          title: 'Find a Location',
          goBack: false,
        });
    }

    updateMapIcons() {
        const {
          region,
          selectedLocation,
          route,
        } = this.state;

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
            markerLocations = popPrioritize(region, 'All');
                                            //'Food & Beverage');
            break;
        }

        // limit the number of markers
        markerLocations = markerLocations.slice(0, 10);


        // is this location not in the marker array?
        const notAddedYet = (loc) => !markerLocations.find(l => l.id == loc.id);

        // add the selected location if needed
        if (selectedLocation && notAddedYet(selectedLocation)) {
            markerLocations.push(selectedLocation);
        }

        // add special marker locations
        this.specialMarkerLocations.forEach(loc => {
          if (notAddedYet(loc)) {
            markerLocations.push(loc);
          }
        });

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

    renderPolyline = () => {
      const polyline = this.state.polyline;

      if (!polyline) {
        return null;
      }

      return (
        <MapView.Polyline
          coordinates={polyline}
          strokeWidth={3}
        />
      );
    }

    // marker deselected
    onPressMap = () => {
      /*
      this.setState({
        selectedLocation: undefined,
      });
      */
    }

    // marker selected
    onPressMarker = (loc) => {
      return (event) => {
        const ref = this.markerRefs[loc.id];
        if (ref) {
          // hide the callout when tapping on the icon with a visible callout
          if (ref.calloutVisible) {
            ref.hideCallout();
          } else {
            ref.showCallout();
          }
          ref.calloutVisible = !ref.calloutVisible;
        }

        this.setState({
          selectedLocation: loc,
        })
      };
    }

    onCalloutPress = (location) => {
      return (event) => {
        console.log(location);

        this.props.navigation.navigate('Details', {
            location: location,
        });
      };
    }

    render() {

        return (
            <View style={styles.container}>

                <TouchableOpacity onPress={this.openSearchMenu}
                  style={[styles.mapViewBtn, styles.searchBtn]}>
                    <MaterialsIcon color='#2af' size={24} name={'search'}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={this.zoomToCurrentLocation}
                  style={[styles.mapViewBtn, styles.myLocationBtn]}>
                    <MaterialsIcon color='#2af' size={24} name={'near-me'}/>
                </TouchableOpacity>

                <MapView style={styles.map}
                    ref={(ref) => this.mapView = ref}
                    customMapStyle={CustomMapStyle}
                    initialRegion={this.initialRegion}
                    zoomEnabled={true}
                    toolBarEnabled={false}
                    showsTraffic={false}
                    showsPointsOfInterest={false}
                    showsIndoors={false}
                    onRegionChange={this.onRegionChange}
                    onPress={this.onPressMap}
                >
                    <MapView.Marker
                        image={dot1}
                        coordinate={this.state.position}
                    />

                    {this.renderPolyline()}

                    {this.state.markerLocations.map(loc => (
                        <MapView.Marker
                          key={loc.id}
                          ref={marker => this.markerRefs[loc.id] = marker}
                          coordinate={{latitude: loc.lat, longitude: loc.long}}
                          title={loc.name}
                          //description={loc.text_description}
                          image={GetIcon(loc.category_id)}
                          onCalloutPress={this.onCalloutPress(loc)}
                          calloutVisible={false}
                        >
                          <TouchableWithoutFeedback
                            onPress={this.onPressMarker(loc)}
                          >
                            <View style={{width:35,height:35}}></View>
                          </TouchableWithoutFeedback>
                        </MapView.Marker>
                    ))}

                </MapView>
            </View>
        );
    }
}

