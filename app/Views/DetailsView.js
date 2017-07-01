import React, { Component } from 'react';
import { BackAndroid, Text, View, Navigator, TouchableHighlight, TouchableOpacity, AsyncStorage } from 'react-native';
import {renderImage, feetCalc} from '../Utils';
import DetailItem from '../Components/DetailItem';
import ListItem from '../Components/ListItem';

const styles = require( "../../assets/css/style");
const dstyles= require('../../assets/css/detailStyle');

class DetailsView extends Component
 {
     static NavigationBarRouteMapper = props => ({
         LeftButton(route, navigator, index, navState) {
             return (
               <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
                   onPress={() => navigator.parentNavigator.pop()}>
                 <Text style={{color: 'white', margin: 10,}}>
                   Back
                 </Text>
               </TouchableOpacity>
             );
         },
         RightButton(route, navigator, index, navState) {
             return null;
         },
         Title(route, navigator, index, navState) {
             return null;
         },
     })

     constructor(props){
       super(props);
       this.state = {
         results: '',
         loaded: false,
         curLocation:this.props.lastLoc.coords
       }
     }

     componentDidMount(){
         this.getAPIData();
     }

     getAPIData(){
       return fetch("http://tours.bruinmobile.com/api/landmark/" + this.props.detID.id)
         .then((response) => response.json())
         .then((responseJson) => {
           this.setState({
             results: responseJson
           });
           this.storeData();
           this.setState({
              loaded: true
           });
         })
         .catch((error) => {
           console.error(error);
         });
     }

     storeData(){
         let data = this.state.results;
         AsyncStorage.setItem('details', JSON.stringify(data));
     }

     render()
     {

         return (
             <Navigator
                 renderScene={this.renderScene.bind(this)}
                 navigator={this.props.navigator}
                 navigationBar={
                   <Navigator.NavigationBar style={{backgroundColor: '#246dd5'}}
                       routeMapper={DetailsView.NavigationBarRouteMapper(this.props)} />
                 } />
        );
    }

    /* Tried to make the back button work, but I'll save it for later.
    componentWillMount() {
      const { navigator } = this.props
        BackAndroid.addEventListener('hardwareBackPress', function() {
                 
          return navigator.parentNavigator.pop();
        });
      }
    */
    renderScene(route, navigator) {
        if(this.state.loaded){
            console.log(this.state.curLocation.latitude);
            //make modules into ListView, each module will have an id, based on which id, the ListView will render that module
            return (
                <View style={styles.container}>
                    <View style={dstyles.titleSec}>
                        {renderImage(this.state.results.results.category,'details')}
                        <Text style={dstyles.title}>
                            {this.state.results.results.name}
                        </Text>
                    </View>
                    <Text style={dstyles.dist}>
                        {feetCalc(this.state.curLocation.latitude,this.state.curLocation.longitude,this.state.results.results.lat,
                        this.state.results.results.long)} feet away
                    </Text>
                </View>
            );
        }
        else
        {
            <View style={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
                <Text style={styles.locText}>

                </Text>
            </View>
        }
    }
}

module.exports = DetailsView;
