/**
 * Created by danielhuang on 9/1/17.
 */
import React, { Component } from 'react';
import {
  Text,
  View,
  ListView
} from 'react-native';

import { TBTItem } from 'app/Components';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

const styles = require( "../../assets/css/style");

export default class LocationListView extends Component
{
  constructor(props){
    super(props);
    this.state = {
      results: '',
    }
  }

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
