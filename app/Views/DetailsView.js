import React, { Component } from 'react';
import { BackAndroid, Button, Text, View, Navigator, TouchableHighlight, TouchableOpacity, AsyncStorage } from 'react-native';

const styles = require( "../../assets/css/style");

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
             return (
               <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
                 <Text style={{color: 'white', margin: 10, fontSize: 16}}>
                    {props.rowData.loc}
                 </Text>
               </TouchableOpacity>
             );
         },
     })

     constructor(props){
       super(props);
       this.state = {
         results: '',
         loaded: false
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
         console.log(this.state.results);
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

    findRoute(){
        console.log(this.props.navigator);
        this.props.navigator.parentNavigator.pop();
        console.log("WENT BACK");
    }

    renderScene(route, navigator) {
        if(this.state.loaded){
            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
                    <Text style={styles.locText}>
                        {this.state.results.results.text_description}
                    </Text>
                    <Button onPress={this.findRoute.bind(this)} title="Navigate Here!"></Button>
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
