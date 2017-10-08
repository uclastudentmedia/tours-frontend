'use strict';

import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';

import {
  GetIndoorBuildingList,
  GetIndoorBuildingByName,
  RouteIndoor,
} from 'app/DataManager';

import {
  styles,
} from 'app/css';

export default class IndoorNavigationView extends Component
{
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  constructor(props){
    super(props);

    this.buildings = GetIndoorBuildingList();
    this.buildingNames = this.buildings.map(building => building.name);

    this.state = {
      error: null,
      loading: false,
      building: null,
      startRoom: null,
      endRoom: null,
      //building: this.buildings[0],
      //startRoom: 'B105',
      //endRoom: '2410',
    };

  }

  selectBuilding = () => {
    this.setState({ error: null });

    this.props.navigation.navigate('Search', {
      title: 'Select building',
      data: this.buildingNames,
      onResultSelect: name => this.setState({
        building: GetIndoorBuildingByName(name),
        startRoom: null,
        endRoom: null,
      })
    });
  }

  selectStartRoom = () => {
    const building = this.state.building;
    if (!building) {
      this.setState({
        error: 'Select a building first.'
      });
      return;
    }

    this.props.navigation.navigate('Search', {
      title: 'Select start room',
      data: building.pois,
      onResultSelect: name => this.setState({
        startRoom: name
      })
    });
  }

  selectEndRoom = () => {
    const building = this.state.building;
    if (!building) {
      this.setState({
        error: 'Select a building first.'
      });
      return;
    }

    this.props.navigation.navigate('Search', {
      title: 'Select end room',
      data: building.pois,
      onResultSelect: name => this.setState({
        endRoom: name
      })
    });
  }

  clear = () => {
    this.setState({
      error: null,
      building: null,
      startRoom: null,
      endRoom: null,
    });
  }

  openImagePage = (buildingName, images) => {
    this.props.navigation.navigate('Image', {
      images: images,
      title: buildingName,
    });
  }

  renderSpinner = () => {
    if (this.state.loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator
            color={'#246dd5'}
            size={'large'}
          />
        </View>
      );
    }
    return null;
  }

  render() {
    const {
      error,
      loading,
      building,
      startRoom,
      endRoom,
    } = this.state;

    const underlayColor = StyleSheet.flatten(styles.indoorsBtnPressedColor).backgroundColor;

    return (
      <View style={styles.container}>

        <View style={styles.indoorsBar}>

          <TouchableHighlight
              style={[styles.directionsBtnTop, styles.indoorsBtnColor]}
              underlayColor={underlayColor}
              onPress={this.selectBuilding}
          >
            <Text style={styles.indoorsText}>
              {building ? building.name : 'Select Building'}
            </Text>
          </TouchableHighlight>
          <View style={styles.indoorHelp}>

          <TouchableHighlight
              style={[styles.indoorsMidBot, styles.indoorsBtnColor]}
              underlayColor={underlayColor}
              onPress={this.selectStartRoom}
          >
            <Text style={styles.indoorsText}>
              {startRoom ? startRoom : 'Select Start Room (optional)'}
            </Text>
          </TouchableHighlight>

          <TouchableHighlight>
            <MaterialsIcon style={styles.helpBtn} color='#ffffff' size={24} name={'help'}/>
          </TouchableHighlight>

          </View>
          <TouchableHighlight
              style={[styles.indoorsBtnBot, styles.indoorsBtnColor]}
              underlayColor={underlayColor}
              onPress={this.selectEndRoom}
          >
            <Text style={styles.indoorsText}>
              {endRoom ? endRoom : 'Select End Room'}
            </Text>
          </TouchableHighlight>

        </View>

        <View style={{marginBottom: 10}}>
          <View style={{marginTop: 10}}>
            <TouchableOpacity
              onPress={this.getDirections.bind(this)}
              style={styles.inStartBtn}>
                <MaterialsIcon color='#ffffff' size={40} name={'directions'}/>
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title={"Clear"}
          onPress={this.clear}
        />

        <Text style={styles.errorText}>{error}</Text>

        {this.renderSpinner()}

      </View>
    );
  }

  async getDirections() {
    let {
      building,
      startRoom,
      endRoom,
    } = this.state;

    if (!endRoom) {
      this.setState({
        error: 'Select an end room.'
      });
      return;
    }

    // if only one room provided, it's a single room lookup
    if (!startRoom) {
      startRoom = endRoom;
    }

    // begin directions request
    this.setState({ loading: true });

    RouteIndoor(building.landmark_id, startRoom, endRoom)
      .then(data => {
        this.setState({
          error: null,
          loading: false,
        });
        this.openImagePage(building.name, data.images);
      })
      .catch(error => {
        this.setState({
          error: error.message,
          loading: false,
        });
      });
  }
}
