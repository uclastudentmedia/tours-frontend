'use strict';

/**
 * Created by Daniel on 2/9/2017.
 */
import React, { Component, PropTypes } from 'react';
import {
    View,
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
            console.log(selected);
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

        return (
            <View style={styles.container}>
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

                    {this.state.markerLocations.map(loc => (
                        <MapView.Marker
                          key={loc.id}
                          coordinate={{latitude: loc.lat, longitude: loc.long}}
                          title={loc.name}
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

