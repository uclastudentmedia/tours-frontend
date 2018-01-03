'use strict';

import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
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
  IndoorsStyle as styles,
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

    this.exit = 'Exit';
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
      dataWithIcons: [{text: this.exit, icon: 'exit-to-app'}],
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

  canRoute = () => {
    const {
      building,
      startRoom,
      endRoom,
    } = this.state;

    if (!building) {
      return false;
    }
    if (!startRoom && !endRoom) {
      return false;
    }
    if (endRoom == this.exit && !startRoom) {
      return false;
    }
    return true;
  }

  getDirections = () => {
    let {
      building,
      startRoom,
      endRoom,
    } = this.state;

    const isRoutingToExit = endRoom == this.exit;

    if (!startRoom && !endRoom) {
      this.setState({
        error: 'Select a room.'
      });
      return;
    }

    if (isRoutingToExit && !startRoom) {
      this.setState({
        error: 'Select a start room.'
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

    RouteIndoor(building.landmark_id, startRoom, endRoom, isRoutingToExit)
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

    const disabled = StyleSheet.flatten(styles.disabled).backgroundColor;
    const underlayActive = StyleSheet.flatten(styles.btnUnderlayColor).backgroundColor;
    const goUnderlayActive = StyleSheet.flatten(styles.goBtnUnderlayColor).backgroundColor;


    const underlayColor = building ? underlayActive : disabled;
    const roomColor = building ? null : styles.disabled;

    const canRoute = this.canRoute();
    const goUnderlay = canRoute ? goUnderlayActive : disabled;
    const goColor = canRoute ? null : styles.disabled;


    return (
        <View>
          <View style={styles.bar}>

            <View style={styles.flexRow}>
              <TouchableHighlight style={styles.btn} underlayColor={underlayActive} onPress={this.selectBuilding}>
                <Text style={styles.btnText}>
                  {building ? building.name : 'Select Building'}
                </Text>
              </TouchableHighlight>
              {building &&
                <TouchableHighlight style={styles.btnIcon} underlayColor={underlayColor} onPress={this.clear}>
                  <MaterialsIcon color='#ffffff' size={28} name={'close'}/>
                </TouchableHighlight>
              }
            </View>

            <TouchableHighlight style={[styles.btn, roomColor]} underlayColor={underlayColor} onPress={this.selectStartRoom}>
              <Text style={styles.btnText}>
                {startRoom ? startRoom : 'Select Start Room'}
              </Text>
            </TouchableHighlight>

            <TouchableHighlight style={[styles.btn, roomColor]} underlayColor={underlayColor} onPress={this.selectEndRoom}>
              <Text style={styles.btnText}>
                {endRoom ? endRoom : 'Select End Room (optional)'}
              </Text>
            </TouchableHighlight>

            <TouchableHighlight style={[styles.btn, styles.goBtn, goColor]} underlayColor={goUnderlay} onPress={this.getDirections}>
              <View style={styles.flexRow}>
                <MaterialsIcon color='#ffffff' size={28} name={'directions'}/>
                <Text style={styles.goText}>GO</Text>
              </View>
            </TouchableHighlight>

          </View>


          <View style={styles.container}>

            <Text style={styles.errorText}>{error}</Text>

            <Text style={styles.helpHeader}>
              Indoor Navigation
            </Text>
            <Text style={styles.helpBody}>
              Indoor navigation helps you find where rooms are. Just select a
              building and a room to get started!
            </Text>
            <Text style={styles.helpBody}>
              To find your way out of a building, find select a nearby room for
              Start Room and "Exit" for End Room.
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
