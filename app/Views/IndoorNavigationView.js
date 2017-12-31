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
  GetIndoorBuildingById,
  RouteIndoor,
} from 'app/DataManager';

import {
  styles,
} from 'app/css';

import _ from 'lodash';

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

  componentWillReceiveProps = (nextProps) => {
    const location = _.get(nextProps, 'navigation.state.params.location');
    if (!location) {
      return;
    }

    this.clear();
    this.setState({
      building: GetIndoorBuildingById(location.id)
    });
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
      title: 'Select end room (optional',
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

  getDirections = () => {
    let {
      building,
      startRoom,
      endRoom,
    } = this.state;

    if (!startRoom && !endRoom) {
      this.setState({
        error: 'Select a room.'
      });
      return;
    }

    // if only one room provided, it's a single room lookup
    if (!startRoom) {
      startRoom = endRoom;
    }
    if (!endRoom) {
      endRoom = startRoom;
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

  render() {
    const {
      error,
      loading,
      building,
      startRoom,
      endRoom,
    } = this.state;

    const disabled = '#888';
    const underlayActive = StyleSheet.flatten(styles.indoorsBtnUnderlayColor).backgroundColor;
    const goUnderlayActive = StyleSheet.flatten(styles.indoorsGoBtnUnderlayColor).backgroundColor;

    var underlayColor = disabled;
    var roomColor = {backgroundColor: disabled};
    if (building) {
      // don't override
      underlayColor = underlayActive;
      roomColor = null;
    }

    var goUnderlay = disabled;
    var goColor = {backgroundColor: disabled};
    // can get directions if at least 1 room is selected
    if (building && (startRoom || endRoom)) {
      goUnderlay = goUnderlayActive;
      goColor = null;
    }


    return (
        <View>
          <View style={styles.indoorsBar}>

            <View style={styles.flexRow}>
              <TouchableHighlight style={styles.indoorsBtn} underlayColor={underlayActive} onPress={this.selectBuilding}>
                <Text style={styles.indoorsText}>
                  {building ? building.name : 'Select Building'}
                </Text>
              </TouchableHighlight>
              {building &&
                <TouchableHighlight style={styles.indoorsBtnIcon} underlayColor={underlayColor} onPress={this.clear}>
                  <MaterialsIcon color='#ffffff' size={28} name={'close'}/>
                </TouchableHighlight>
              }
            </View>

            <TouchableHighlight style={[styles.indoorsBtn, roomColor]} underlayColor={underlayColor} onPress={this.selectStartRoom}>
              <Text style={styles.indoorsText}>
                {startRoom ? startRoom : 'Select Start Room'}
              </Text>
            </TouchableHighlight>

            <TouchableHighlight style={[styles.indoorsBtn, roomColor]} underlayColor={underlayColor} onPress={this.selectEndRoom}>
              <Text style={styles.indoorsText}>
                {endRoom ? endRoom : 'Select End Room (optional)'}
              </Text>
            </TouchableHighlight>

            <TouchableHighlight style={[styles.indoorsBtn, styles.indoorsGoBtn, goColor]} underlayColor={goUnderlay} onPress={this.getDirections}>
              <View style={styles.flexRow}>
                <MaterialsIcon color='#ffffff' size={28} name={'directions'}/>
                <Text style={styles.indoorsGoText}>GO</Text>
              </View>
            </TouchableHighlight>

          </View>


          <View style={styles.indoorsContainer}>

            <Text style={styles.errorText}>{error}</Text>

            <Text style={styles.indoorsHelpHeader}>
              Indoor Navigation
            </Text>
            <Text style={styles.indoorsHelpBody}>
              Indoor navigation helps you find where rooms are. Just select a
              building and a room to get started!
            </Text>
            <Text style={styles.indoorsHelpBody}>
              To find your way out of a building, find select a nearby room for
              Start Room and "Entry" for End Room.
            </Text>

            <View collapsable={false}>
              {loading &&
                <ActivityIndicator
                  color={'#246dd5'}
                  size={'large'}
                />
              }
            </View>

          </View>

        </View>
    );
  }
}
