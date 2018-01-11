'use strict';

import React, { Component, PropTypes } from 'react';
import {
    View,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Text,
    Image,
    Platform,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import PubSub from 'pubsub-js';
import { debounce } from 'lodash';

import MapView from 'react-native-maps';

import {
  popPrioritize,
  inRegion,
  GetCurrentLocationObject,
  CURRENT_LOCATION_ID,
} from 'app/Utils';

import {
  GetLocationList,
  GetLocationByName,
} from 'app/DataManager';

import { DirectionsBar } from 'app/Components';

import GPSManager from 'app/GPSManager';

import {
  GetIcon,
  paw_blue,
  paw_white,
  dot1,
} from 'app/Assets';

import { styles, CustomMapStyle } from 'app/css';

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
        this.region = this.initialRegion;

        this.state = {
            //position: this.initialPosition,
            markerLocations: popPrioritize(this.initialRegion).slice(0, 10),
            results: [],
            route: {},
            directionsBarVisible: false,
        };

        this.firstOnRegionChange = true;

        this.onRegionChange = debounce(this.onRegionChange.bind(this), 100);

        this.markerRefs = {};
        this.specialMarkerLocations = []; // for route start/end, details, etc.

        this.subscribe();
    }

    componentDidMount() {
        // get position
        this.watchID = this.GPSManager.watchPosition(position => {
            this.setState({
                position: position,
            });
        });

        // verify that we have location services
        this.GPSManager.getPosition(() => {});
    }

    componentWillUnmount(){
        this.GPSManager.clearWatch(this.watchID);
    }

    subscribe = () => {

      PubSub.subscribe('showRouteOnMap', (msg, route) => {
        const {
          locations,
          polyline,
          calloutMarker,
        } = route;

        this.specialMarkerLocations = locations;

        this.updateMapIcons();

        this.setState({ polyline: polyline });

        this.mapView.fitToCoordinates(polyline, {
          edgePadding: Platform.select({
            android: { top:800, left:200, right:200, bottom:200 },
            ios: { top:100, left:100, right:100, bottom:100 },
          })
        });

        if (calloutMarker) {
          const markerRef = this.markerRefs[calloutMarker.id];
          if (markerRef) {
            markerRef.showCallout();
          }
        }
      });

      PubSub.subscribe('showLocationOnMap', (msg, location) => {
        if (this.state.directionsBarVisible) {
          this.toggleDirections();
        }
        this.setState({selectedLocation: location});
        this.updateMapIcons();

        this.mapView.animateToRegion({
          latitude: location.lat,
          longitude: location.long,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 1000);
        const markerRef = this.markerRefs[location.id];
        if (markerRef) {
          markerRef.showCallout();
        }
      });

      PubSub.subscribe('showRouteToLocation', (msg, location) => {
        this.setState({ directionsBarVisible: true });
        this.directionsBar.SetVisible(true);

        const currentLocation = GetCurrentLocationObject(this.state.position);
        if (!currentLocation) {
          // force update
          this.GPSManager.getPosition(position => {
            const loc = GetCurrentLocationObject(position);
            this.directionsBar.SetInput({
              startLocation: loc,
              endLocation: location,
            });
            this.forceUpdatePosition(position);
          });
        }
        this.directionsBar.SetInput({
          startLocation: currentLocation,
          endLocation: location,
        });
      });

      PubSub.subscribe('stopTour', () => {
        this.resetMap();
      });
    }

    forceUpdatePosition = (position) => {
      this.setState({
        position: position
      });
    }

    zoomToCurrentLocation = () => {
        const currentLocation = GetCurrentLocationObject(this.state.position);
        if (!currentLocation) {
          // force update
          this.GPSManager.getPosition(position => {
              this.forceUpdatePosition(position);
              this.zoomToCurrentLocation();
          });
          return;
        }

        this.mapView.animateToRegion({
          latitude: currentLocation.lat,
          longitude: currentLocation.long,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 500);
    }

    zoomToCampus = () => {
        this.mapView.animateToRegion(this.initialRegion, 500);
    }

    toggleDirections = () => {
      let visible = !this.state.directionsBarVisible;

      this.setState({
        directionsBarVisible: visible
      });
      this.directionsBar.SetVisible(visible);

      // if a location is selected, route to it
      // TODO: reliably tell if a location is selected
      /*
      if (visible && this.state.selectedLocation) {
        PubSub.publish('showRouteToLocation', this.state.selectedLocation);
      }
      */

      if (!visible) {
        this.resetMap();
        this.directionsBar.Clear();
      }
    }

    resetMap = () => {
        this.specialMarkerLocations = [];
        this.setState({ polyline: null });
        this.updateMapIcons();
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
          selectedLocation,
        } = this.state;

        var markerLocations = [].concat(this.specialMarkerLocations);

        // is this location not in the marker array?
        const notAddedYet = (loc) => !markerLocations.find(l => l.id == loc.id);

        // if no special locations, add popular marker locations
        if (this.specialMarkerLocations.length === 0) {
          // add the selected location if needed
          if (selectedLocation && notAddedYet(selectedLocation)) {
              markerLocations.push(selectedLocation);
          }

          // add popular locations
          var popularLocations = popPrioritize(this.region).slice(0, 10);

          popularLocations.forEach(loc => {
            if (notAddedYet(loc)) {
              markerLocations.push(loc);
            }
          });
        }

        // remove locations not in the view
        markerLocations = markerLocations.filter(loc => {
          var region = { ...this.region };
          region.latitudeDelta  *= 1.2;
          region.longitudeDelta *= 1.2;
          return inRegion(region, loc.lat, loc.long);
        });

        // remove current location
        markerLocations = markerLocations.filter(loc => {
          return loc.id != CURRENT_LOCATION_ID;
        });

        this.setState({
            markerLocations: markerLocations
        });
    }

    onRegionChange(region) {
      if (this.firstOnRegionChange) {
        this.firstOnRegionChange = false;
        return;
      }
      this.region = region;
      PubSub.publish('onRegionChange', region);
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
          strokeWidth={5}
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
      });
    }

    onCalloutPress = (location) => {
      this.props.navigation.navigate('Details', {
          location: location,
      });
    }

    render() {
        const {
          position,
          markerLocations,
          directionsBarVisible,
        } = this.state;

        const pawIcon = Platform.select({
          ios: paw_blue,
          android: paw_white,
        });

        return (
            <View style={styles.container}>

                <View style={styles.searchBar}>
                  <Image source={pawIcon}/>
                  <Text style={[styles.baseText, styles.titleText]}>UCLA Maps</Text>
                  <TouchableOpacity onPress={this.openSearchMenu}
                    style={styles.mapViewSearchBtn}>
                      <MaterialIcon color='#cccccc' size={30} name='search'/>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={this.zoomToCurrentLocation}
                  style={[styles.mapViewBtn, styles.myLocationBtn]}>
                    <MaterialIcon color='#246dd5' size={20} name='near-me'/>
                </TouchableOpacity>

                <TouchableOpacity onPress={this.zoomToCampus}
                  style={[styles.mapViewBtn, styles.zoomToCampusBtn]}>
                    <MaterialIcon color='#246dd5' size={20} name='zoom-out-map'/>
                </TouchableOpacity>

                <TouchableOpacity onPress={this.toggleDirections}
                  style={[styles.mapViewBtn, styles.toggleDirectionsBtn]}>
                  {directionsBarVisible ?
                    <View>
                      <MaterialIcon color='#ffffff' size={30} name='close'/>
                    </View>
                  :
                    <View>
                      <MaterialIcon color='#ffffff' size={20} name='directions'/>
                      <Text style={styles.toggleDirectionsText}>GO</Text>
                    </View>
                  }
                </TouchableOpacity>

                <DirectionsBar {...this.props}
                    ref={ref => this.directionsBar = ref}
                    forceUpdatePosition={this.forceUpdatePosition}
                />

                <MapView style={styles.map}
                    ref={(ref) => this.mapView = ref}
                    customMapStyle={CustomMapStyle}
                    initialRegion={this.initialRegion}
                    zoomEnabled={true}
                    toolbarEnabled={false}
                    showsTraffic={false}
                    showsPointsOfInterest={false}
                    showsIndoors={false}
                    onRegionChange={this.onRegionChange}
                    onPress={this.onPressMap}
                >
                    {position && inRegion(this.region, position.latitude, position.longitude) ?
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
                          ref={marker => { this.markerRefs[loc.id] = marker; }}
                          coordinate={{latitude: loc.lat, longitude: loc.long}}
                          anchor={{x: 0.5, y: 0.5}}
                          title={loc.name}
                          description={loc.markerDescription}
                          image={GetIcon(loc.category_id)}
                          onCalloutPress={() => this.onCalloutPress(loc)}
                          calloutVisible={false}
                        >
                          <TouchableWithoutFeedback
                            onPress={() => this.onPressMarker(loc)}
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
