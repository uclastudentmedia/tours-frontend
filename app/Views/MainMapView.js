'use strict';

/**
 * Created by Daniel on 2/9/2017.
 */
import React, { Component, PropTypes } from 'react';
import {
    View,
    TouchableWithoutFeedback,
} from 'react-native';

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

import GPSManager from 'app/GPSManager';

import { GetIcon, dot1 } from 'app/Assets';

import { styles, CustomMapStyle } from 'app/css';

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
        };
        this.onRegionChange = debounce(this.onRegionChange.bind(this), 100);

        this.markerRefs = {};
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

        var markerLocations = popPrioritize(this.state.region,
                                            'All');

        // limit the number of markers
        markerLocations = markerLocations.slice(0, 10);

        // add the selected location if needed
        const selected = this.state.selectedLocation;
        if (selected && !markerLocations.find(l => l.id == selected.id)) {
            markerLocations.push(selected);
        }

        this.setState({
            markerLocations: markerLocations
        });
    }

    onRegionChange(region) {
      this.setState({ region:region });
      PubSub.publish('MainMapView.onRegionChange', region);
      this.updateMapIcons();
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
                <MapView style={styles.map}
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

                    {this.state.markerLocations.map(loc => (
                        <MapView.Marker
                          key={loc.id}
                          ref={marker => this.markerRefs[loc.id] = marker}
                          coordinate={{latitude: loc.lat, longitude: loc.long}}
                          title={loc.name}
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

