/**
 * Created by danielhuang on 9/2/17.
 */
import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';

import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';

import { renderImage, feetCalc } from 'app/Utils';
import { RouteTBT } from 'app/DataManager';

import {
  TBTItem,
  SearchContainer,
} from 'app/Components';

const styles = require( "../../assets/css/style");
const dstyles= require('../../assets/css/detailStyle');

export default class DirectionsView extends Component
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
            viewIDG: 1,
            directions: {},
        };
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

    renderScene(route, navigator) {

        const {
          startLocation,
          endLocation,
          directions,
        } = this.state;

        return (
            <View style={styles.container}>
                <Text style={styles.title}>This is the Directions View</Text>

                <Text>{JSON.stringify(directions)}</Text>
                <Button
                  title='Get Directions'
                  onPress={this.getDirections.bind(this)}
                />

                <Text>From: {startLocation ? startLocation.name : ''}</Text>
                <Text>To: {endLocation ? endLocation.name : ''}</Text>


                <View style={{flexDirection: 'row', flex: 1}}>
                  <SearchContainer style={{flexDirection: 'column'}}
                    locations={this.props.locations}
                    onResultSelect={this.setStartLocation.bind(this)}
                    maxResults={5}
                  />
                  <SearchContainer style={{flexDirection: 'column'}}
                    locations={this.props.locations}
                    onResultSelect={this.setEndLocation.bind(this)}
                    maxResults={5}
                  />
                </View>

                {this.renderGlobalNav()}
            </View>
        );
    }

    setStartLocation(result) {
      this.setState({
        startLocation: result
      });
    }

    setEndLocation(result) {
      this.setState({
        endLocation: result
      });
    }

    async getDirections() {
      const {
        startLocation,
        endLocation
      } = this.state;

      const extraOptions = {};

      RouteTBT(startLocation, endLocation, extraOptions)
        .then(data => this.setState({directions: data}))
        .catch(console.error);
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
