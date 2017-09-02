/**
 * Created by danielhuang on 9/2/17.
 */
/**
 * Created by danielhuang on 9/1/17.
 */
import React, { Component } from 'react';
import { BackAndroid, Text, View, Navigator, TouchableHighlight, TouchableOpacity, AsyncStorage, ListView } from 'react-native';
import {renderImage, feetCalc} from '../Utils';
import TBTItem from '../Components/ListItem';
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation'
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

const styles = require( "../../assets/css/style");
const dstyles= require('../../assets/css/detailStyle');

class DirectionsView extends Component
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
    });
    //function to go to a different view
    gotoView(viewID){
        switch(viewID)
        {
            case 0:
                this.setState({viewIDG: 0});
                this.props.navigator.push({
                    id: 'MainMapView',
                    name: 'Home',
                });
                break;
            case 2:
                this.setState({viewIDG: 2});
                this.props.navigator.push({
                    id: 'LocationListView',
                    name: 'Nearby Locations',
                });
                break;
            case 1:
                this.setState({viewIDG: 1});
                this.props.navigator.push({
                    id: 'DirectionsView',
                    name: 'GPS Navigation',
                });
                break;
        }
    }

    constructor(props){
        super(props);
        this.state = {
            results: '',
            loaded: true,
            viewIDG: 1
        }
    }

    render()
    {
        return (
            <Navigator
                renderScene={
                    this.renderScene.bind(this)
                }
                navigator={this.props.navigator}
                navigationBar={
                    <Navigator.NavigationBar style={{backgroundColor: '#246dd5'}}
                                             routeMapper={DirectionsView.NavigationBarRouteMapper(this.props)} />
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
            console.log("Hello World");
            //make modules into ListView, each module will have an id, based on which id, the ListView will render that module
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>This is the Directions View</Text>
                    {this.renderGlobalNav()}
                </View>
            );
        }
        else
        {
            <View style={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
                <Text style={styles.locText}>
                    Test
                </Text>
            </View>
        }
    }
    renderGlobalNav(){
        return(
            <BottomNavigation
                labelColor="grey"
                style={{ height: 56, elevation: 8, position: 'absolute', left: 0, bottom: 0, right: 0 }}
                onTabChange={(newTabIndex) => this.gotoView(newTabIndex)}
                activeTab={this.state.viewIDG}
            >
                <Tab
                    barBackgroundColor="white"
                    label="Maps"
                    icon={<MaterialsIcon size={24} color="#CCCCCC" name="tv" />}
                />
                <Tab
                    barBackgroundColor="white"
                    label="Directions"
                    icon={<MaterialsIcon size={24} color="#CCCCCC" name="music-note"/>}
                />
                <Tab
                    barBackgroundColor="white"
                    label="Nearby"
                    icon={<MaterialsIcon size={24} color="#CCCCCC" name="account-box"/>}
                />
            </BottomNavigation>
        );
    }
}
module.exports = DirectionsView;