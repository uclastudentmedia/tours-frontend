'use strict';

import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  ListView,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';

import {
  GetIndoorBuildingList,
  GetIndoorBuildingByName,
  RouteIndoor,
} from 'app/DataManager';

import {
  styles,
  DirectionsStyle,
} from 'app/css';

export default class IndoorNavigationView extends Component
{
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  constructor(props){
    super(props);

    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.buildings = GetIndoorBuildingList();
    this.buildingNames = this.buildings.map(building => building.name);

    this.state = {
      error: null,
      imageDataSource: this.ds.cloneWithRows([]),
      loading: false,
      building: this.buildings[0],
      startRoom: 'B105',
      endRoom: '2410',
    };

  }

  selectBuilding = () => {
    this.setState({ error: null });

    this.props.navigation.navigate('Search', {
      title: 'Select building',
      data: this.buildingNames,
      onResultSelect: name => this.setState({
        building: GetIndoorBuildingByName(name)
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
      imageDataSource: this.ds.cloneWithRows([]),
    });
  }

  openImage = (image) => {
    console.log(image);
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

    return (
      <View style={DirectionsStyle.container}>

        <Text style={styles.errorText}>{error}</Text>

        <ListView
          enableEmptySections={true}
          dataSource={this.state.imageDataSource}
          renderRow={(image) =>
            <TouchableOpacity style={styles.wrapper}
              onPress={() => this.openImage(image)}
            >
              <View style={styles.wrapper}>
                <Text style={[styles.baseText, styles.locText]}>
                  {building.name}, Floor {image.floor}
                </Text>
                <Image source={{uri: image.url}} style={{width: 40, height: 40}}/>
              </View>
            </TouchableOpacity>
          }
        />

        {this.renderSpinner()}

        <Button
          title={"Select building"}
          onPress={this.selectBuilding}
        />

        <Button
          title={"Select start room"}
          onPress={this.selectStartRoom}
        />

        <Button
          title={"Select end room"}
          onPress={this.selectEndRoom}
        />

        <View style={{marginBottom: 10}}>
          <Text>Building: {building ? building.name : ''}</Text>
          <Text>From: {startRoom}</Text>
          <Text>To: {endRoom}</Text>
          <View style={{marginTop: 10}}>
            <Button
              title='Get Directions'
              onPress={this.getDirections.bind(this)}
            />
          </View>
        </View>

        <Button
          title={"Clear"}
          onPress={this.clear}
        />

      </View>
    );
  }

  async getDirections() {
    const {
      building,
      startRoom,
      endRoom,
    } = this.state;

    if (!startRoom || !endRoom) {
      this.setState({
        error: 'Select a start and end room.'
      });
      return;
    }

    // begin directions request
    this.setState({ loading: true });

    RouteIndoor(building.landmark_id, startRoom, endRoom)
      .then(data => {
        this.setState({
          error: null,
          imageDataSource: this.ds.cloneWithRows(data.images),
          loading: false,
        });
      })
      .catch(error => {
        this.setState({
          error: error.message,
          loading: false,
        });
      });
  }
}
