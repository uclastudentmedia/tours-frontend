'use strict';

import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  Button,
  Dimensions,
  TouchableHighlight,
  Alert,
} from 'react-native';
import PubSub from 'pubsub-js';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { Tour } from 'app/DataTypes';
import {
  GetLocationById,
  RouteTBT,
} from 'app/DataManager';
import {
  DecodePolyline,
} from 'app/Utils';

import { GetIcon, logo } from 'app/Assets';
import { ToursDetailStyle as styles } from 'app/css';

export default class ToursDetailView extends Component
{
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          tour: PropTypes.instanceOf(Tour).isRequired,
        })
      })
    }),
  };

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.tour.name}`,
  });

  constructor(props) {
    super(props);
    this.tour = props.navigation.state.params.tour;
    this.locations = this.tour.landmark_ids.map(GetLocationById);
    
    this.state = {
      tourStarted: false,
    };
  }

  gotoDetail = (location) => {
    this.props.navigation.navigate('Details', {
      location: location
    });
  }

  startTour = () => {
    this.setState({ tourStarted: true });

    RouteTBT(this.locations)
      .then(data => {
        if (!data || !this.locations.length) {
          return;
        }
        if (data.error) {
          Alert.alert(data.error);
          return;
        }

        const polylines = data.trip.legs.map(leg =>
          DecodePolyline(leg.shape).map(coord => ({
            latitude: coord[0],
            longitude: coord[1]
          }))
        );

        const locationCoords = this.locations.map(loc => ({
            latitude: loc.lat,
            longitude: loc.long,
        }));

        // connect polylines and locations
        let coords = [locationCoords[0]];
        for (let i = 0; i < polylines.length; i++) {
          coords = coords.concat(polylines[i], locationCoords[i+1]);
        }

        PubSub.publish('showRouteOnMap', {
          polyline: coords,
          locations: this.locations,
          calloutMarker: this.locations[0],
        });
      })
      .catch(error => {
        Alert.alert(error.message);
      });
    this.props.navigation.navigate('MainMap');
  }

  stopTour = () => {
    this.setState({ tourStarted: false });
    PubSub.publish('stopTour');
  }

  render() {
    const {
      name,
      image,
      duration,
      distance,
      text_description,
    } = this.tour;

    const {
      tourStarted
    } = this.state;

    return (
      <ScrollView contentContainerStyle={{flex:0}}>
        <View style={styles.container}>
          <Image source={{uri: image}} style={styles.image}/>
          <View style={styles.contentContainer}>
            <Text style={styles.name}>{name}</Text>
            {tourStarted ? (
              <Button title='Stop Tour' onPress={this.stopTour}/>
            ) : (
              <Button title='Start Tour' onPress={this.startTour}/>
            )}
            <Text style={styles.length}>{duration} minutes ({distance} mi)</Text>
            <Text style={styles.description}>{text_description}</Text>

            <Text style={styles.header}>Locations</Text>
            {this.locations.map(loc => (
                <View key={loc.id}>
                  <Button title={loc.name} onPress={() => this.gotoDetail(loc)}/>
                </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }
}