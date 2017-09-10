'use strict';

/**
 * Created by danielhuang on 9/1/17.
 */
import React, { Component } from 'react';
import {
  Text,
  View,
  ListView,
  TouchableOpacity,
  Button
} from 'react-native';
import { initializeParameters, popLocationListView, setCategory } from 'app/LocationPopManager'
import { GetLocationList } from 'app/DataManager';
import {popPrioritize, LocToData,RenderIcon} from 'app/Utils'

import { styles } from 'app/css';

var initialPosition = {coords: {latitude: 34.070286, longitude: -118.443413}};
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});

export default class LocationListView extends Component
{
  constructor(props){
      super(props);
      this.initialRegion = {
          latitude: 34.070286,
          longitude: -118.443413,
          latitudeDelta: 0.0045,
          longitudeDelta: 0.0345,
      };
      this.dataPop = [];
      this.state = {
          dataSource: ds.cloneWithRows(this.dataPop),
          markers: [],
          region: this.initialRegion,
          results: []
      };
      console.log(this.state);
  }
  componentDidMount() {
      this.getPosition();
      this.getData();
  }

  async getData() {
        this.locations = GetLocationList();
        this.getLocations('All');
  }

  getPosition(){
    navigator.geolocation.getCurrentPosition(
        (position) => {
            var initialPosition2 = JSON.stringify(position);
            var val = JSON.parse(initialPosition2);
            initialPosition = val;
            this.setState({lastPosition: val});
        },
        (error) => alert(JSON.stringify(error)),
        {enableHighAccuracy: true, timeout: 2000000, maximumAge: 500}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
        var lastPosition = JSON.stringify(position);
        var val = JSON.parse(lastPosition);
        this.setState({lastPosition: val});
    });
  }
  getLocations(category){
      let val = this.locations;
      console.log("hi");
      console.log(this.locations);
      if(!val) {
          return [];
      }
      //Get list of top 10 locations
      //edit: need to change to current gps location, NOT initial position
      const temp = popPrioritize(val,
          this.initialRegion.latitude,
          this.initialRegion.longitude,
          this.initialRegion.latitudeDelta,
          this.initialRegion.longitudeDelta,category);
      let locTemp=[];
      console.log("templength"+temp.length);
      for(var i = 0; i < temp.length; i++) {
          //push location data onto data
          var locData = {loc:"", dist:0,catID:1,images:[]};
          var distance = Math.round(temp[i].distanceAway);
          locData.loc = temp[i].location;
          locData.dist = distance;
          locData.images = temp[i].images;
          if(!locData.images)
            locData.images = [];
          console.log(locData);
          var specLoc = LocToData(locData.loc, val);
          if (specLoc && specLoc.category_id) {
              locData.catID = specLoc.category_id;
          }
          this.dataPop = this.dataPop.concat(locData);
      }
      this.setState({
        dataSource: ds.cloneWithRows(this.dataPop),
      });
  }
    gotoDescription(rowData) {
        let id = LocToData(rowData.loc, this.locations);
        this.props.navigation.navigate('Details', {
            id: 'Details',
            rowDat: rowData,
            locID: id,
            title: rowData.loc,
        });
    }
    //this.ds.cloneWithRows(this.getLocations)}
  render() {
    //make modules into ListView, each module will have an id, based on which
    //id, the ListView will render that module
    return (
      <View style={styles.container}>
          <ListView
              enableEmptySections={true}
              dataSource={this.state.dataSource}
              renderRow={(rowdata) =>
                <TouchableOpacity onPress={this.gotoDescription.bind(this, rowdata)} style={styles.wrapper}>
                    <View style={styles.wrapper}>
                      {RenderIcon(rowdata.catID)}
                      <Text style={styles.baseText}>
                        <Text style={styles.locText}>
                          {rowdata.loc}{'\n'}
                          <Text style={styles.distText}>
                            {rowdata.dist} feet away
                          </Text>
                        </Text>
                      </Text>
                    </View>
                </TouchableOpacity>
              }
          />
      </View>
    );
  }
}
/*
 renderDragMenu(){
 return (
 <View style={styles.info}>
 <ListView
 style={styles.locations}
 dataSource={this.state.dataSource}
 renderRow={(rowData) =>
 <View>
 <TouchableOpacity onPress={this.gotoDescription.bind(this, rowData)} style={styles.wrapper}>
 <ListItem rowData={rowData}/>
 </TouchableOpacity>
 <View style={styles.separator} />
 </View>}
 enableEmptySections={true}
 showsVerticalScrollIndicator={false}
 />
 </View>
 );
 }
* */
