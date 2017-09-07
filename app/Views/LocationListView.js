/**
 * Created by danielhuang on 9/1/17.
 */
import React, { Component } from 'react';
import {
  Text,
  View,
  ListView
} from 'react-native';
import { GetLandmarkList } from 'app/DataManager';
import {popPrioritize, LocToData} from '../Utils'

var initialPosition = {coords: {latitude: 34.070286, longitude: -118.443413}};
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const styles = require( "../../assets/css/style");

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
      this.getData()
            .catch(console.error);
  }

  async getData() {
        this.landmarks = await GetLandmarkList();
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
  getLocations(){
      val = this.landmarks;
      if(!val) {
          return [];
      }
      console.log(this.state.region);
      //Get list of top 10 locations
      //edit: need to change to current gps location, NOT initial position
      const temp = popPrioritize(val,
          this.initialRegion.latitude,
          this.initialRegion.longitude,
          this.initialRegion.latitudeDelta,
          this.initialRegion.longitudeDelta);
      locTemp=[];
      for(var i = 0; i < temp.length; i++) {
          //push location data onto data
          var locData = {loc:"", dist:0,catID:1,images:[]};
          var distance = Math.round(temp[i].distanceAway);
          locData.loc = temp[i].location;
          locData.dist = distance;
          locData.images = temp[i].images;
          var specLoc = LocToData(locData.loc, val);
          if (specLoc && specLoc.category_id) {
              locData.catID = specLoc.category_id;
          }
          this.dataPop = this.data.concat(locData);
      }
      this.setState({
        ds: this.state.ds.cloneWithRows(this.dataPop),
      });
      console.log("Data Pop is returned!");
      //console.log(dataPop);
  }
    //this.ds.cloneWithRows(this.getLocations)}
  render() {
    console.log("LocationListView");
    //make modules into ListView, each module will have an id, based on which
    //id, the ListView will render that module
    return (
      <View style={styles.container}>
        <Text style={styles.title}>This is the Locations List View</Text>

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
