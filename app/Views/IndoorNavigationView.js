'use strict';

import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  ListView,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
  Image,
} from 'react-native';

import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';

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
    this.props.navigation.navigate('Image', {
      title: image.floor,
      imageUrl: image.url,
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
              <View style={styles.flexRow}>
                <Text style={[styles.baseText, styles.locText]}>
                  {image.floor}
                </Text>
                <Image source={{uri: image.url}}
                  style={{width: 40, height: 40}}
                />
              </View>
            </TouchableOpacity>
          }
        />

        {this.renderSpinner()}

        <View style={styles.indoorsBar}>

          <TouchableHighlight
              style={[styles.directionsBtnTop, styles.indoorsBtnColor]}
              onPress={this.selectBuilding}
          >
            <Text style={styles.indoorsText}>
              Select Building
            </Text>
          </TouchableHighlight>

          <TouchableHighlight
              style={[styles.directionsBtnBot, styles.indoorsBtnColor]}
              onPress={this.selectStartRoom}
          >
            <Text style={styles.indoorsText}>
              Select Start Room
            </Text>
          </TouchableHighlight>

          <TouchableHighlight
              style={[styles.indoorsBtnBot, styles.indoorsBtnColor]}
              onPress={this.selectEndRoom}
          >
            <Text style={styles.indoorsText}>
              Select End Room
            </Text>
          </TouchableHighlight>

        </View>

        <View style={{marginBottom: 10}}>
          <Text>Building: {building ? building.name : ''}</Text>
          <Text>From: {startRoom}</Text>
          <Text>To: {endRoom}</Text>
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
