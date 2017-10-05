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
    Text,
    Image,
    Platform
} from 'react-native';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';

import PubSub from 'pubsub-js';
import { debounce } from 'lodash';

import MapView from 'react-native-maps';

import {
  popPrioritize,
  inRegion,
} from 'app/Utils';

import {
  GetLocationList,
  GetLocationByName,
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

        this.locationNames = GetLocationList()
                                .sort((a,b) => a.priority - b.priority)
                                .map(loc => loc.name);

        //this.initialPosition = {
        //  latitude: 34.070286,
        //  longitude: -118.443413,
        //};

        this.initialRegion = {
          latitude: 34.0700086,
          longitude: -118.446003,
          latitudeDelta: 0.03,
          longitudeDelta: 0.02,
        };

        this.state = {
            //position: this.initialPosition,
            markerLocations: [],
            region: this.initialRegion,
            results: [],
            route: {}
        };
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
        const {
          position
        } = this.state;
        if (!position) {
          alert('Unable to find your location.');
          return;
        }
        this.mapView.animateToRegion({
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 500);
    }

    zoomToCampus = () => {
        this.mapView.animateToRegion(this.initialRegion, 500);
    }

    openSearchMenu = () => {
        const {
          navigation
        } = this.props;

        navigation.navigate('Search', {
          title: 'Find a Location',
          goBack: false,
          data: this.locationNames,
          onResultSelect: function(name) {
            navigation.navigate('Details', {
              location: GetLocationByName(name),
              goBackFrom: this.props.navigation.state.key // `this` is binded to SearchView
            })
          }
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

        // remove locations not in the view
        markerLocations = markerLocations.filter(loc => {
          return inRegion(region, loc.lat, loc.long);
        });

        this.setState({
            markerLocations: markerLocations
        });
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

    getCompassDirection = () => {
      const {
        position
      } = this.state;
      // 0 degrees = north
      let degrees = 0;
      if (position) {
        // TODO: use react-native-simple-compass
        degrees = position.heading;
      }
      return degrees - 73;
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
          strokeColor={'#246dd5'}
        />
      );
    }

    renderLocationAccuracyCircle = () => {
      const {
        position
      } = this.state;
      if (!position || position.accuracy === undefined) {
        return null;
      }

      return (
        <MapView.Circle
            key={(position.longitude + position.latitude + position.accuracy).toString()}
            center={position}
            radius={position.accuracy}
            strokeColor={'#246dd5'}
            fillColor={'#246dd544'}
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
        const {
          position,
          region,
          markerLocations,
        } = this.state;

        const file = Platform.select({
          ios: require('../../assets/app_assets/tab_navigator_icons/mapsclickedArtboard1.png'),
          android: require('../../assets/app_assets/tab_navigator_icons/mapsunclickedArtboard1.png'),
        });

        return (
            <View style={styles.container}>

                <View style={styles.searchBar}>
                  <Image source={file}/>
                  <Text style={[styles.baseText, styles.titleText]}>UCLA Map</Text>
                  <TouchableOpacity onPress={this.openSearchMenu}
                    style={styles.mapViewSearchBtn}>
                      <MaterialsIcon color='#cccccc' size={30} name={'search'}/>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={this.zoomToCurrentLocation}
                  style={[styles.mapViewBtn, styles.myLocationBtn]}>
                    <MaterialsIcon color='#ffffff' size={24} name={'near-me'}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={this.zoomToCampus}
                  style={[styles.mapViewBtn, styles.zoomToCampusBtn]}>
                    <MaterialsIcon color='#ffffff' size={24} name={'zoom-out-map'}/>
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
                    onMapReady={this.updateMapIcons}
                >
                    {position && inRegion(region, position.latitude, position.longitude) ?
                      <MapView.Marker
                          image={dot1}
                          coordinate={this.state.position}
                          rotation={this.getCompassDirection()}
                          anchor={{x: 0.5, y: 0.5}}
                          style={{zIndex: 1}}
                      />
                    : null}
                    {this.renderLocationAccuracyCircle()}

                    {this.renderPolyline()}

                    {markerLocations.map(loc => (
                        <MapView.Marker
                          key={loc.id}
                          ref={marker => this.markerRefs[loc.id] = marker}
                          coordinate={{latitude: loc.lat, longitude: loc.long}}
                          anchor={{x: 0.5, y: 0.5}}
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

