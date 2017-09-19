'use strict';

/**
 * Created by Daniel on 2/9/2017.
 */
import React, { Component, PropTypes } from 'react';
import {
    View,
    ListView,
    TouchableWithoutFeedback,
} from 'react-native';

import PubSub from 'pubsub-js';
import { debounce } from 'lodash';

import MapView from 'react-native-maps';
import SearchBar from 'react-native-searchbar';

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

// hide the normal locations?
const ONLY_SHOW_ROUTE = true;

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
            results: [],
            route: {}
        };
        this._handleResults = this._handleResults.bind(this);
        this.onRegionChange = debounce(this.onRegionChange.bind(this), 100);

        this.markerRefs = {};

        PubSub.subscribe('DirectionsView.showRouteOnMap', (msg, route) => {
          this.setState({ route });
          this.updateMapIcons();
        });
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

        const {
          region,
          selectedLocation,
          route,
        } = this.state;

        var markerLocations = [];

        if (route.startLocation && route.endLocation) {
          markerLocations = markerLocations.concat(route.startLocation,
                                                   route.endLocation);

          if (ONLY_SHOW_ROUTE) {
            this.setState({
              markerLocations: markerLocations
            });
            return;
          }
        }

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

        // add the selected location if needed
        const selected = selectedLocation;
        if (selected && !markerLocations.find(l => l.id == selected.id)) {
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

    renderPolyline = () => {
      const path = this.state.route.path;

      if (!path) {
        return null;
      }

      return (
        <MapView.Polyline
          coordinates={path}
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
            id: 'Details',
            title: location.name,
            location: location,
        });
      };
    }

    render() {

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

