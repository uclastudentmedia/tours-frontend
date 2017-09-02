/**
 * Created by danielhuang on 9/1/17.
 */
import React, { Component } from 'react';
import { BackAndroid, Text, View, Navigator, TouchableHighlight, TouchableOpacity, AsyncStorage, ListView } from 'react-native';
import {renderImage, feetCalc} from '../Utils';
import TBTItem from '../Components/ListItem';
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

const styles = require( "../../assets/css/style");
const dstyles= require('../../assets/css/detailStyle');

class LocationListViewView extends Component
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
                                             routeMapper={LocationListViewView.NavigationBarRouteMapper(this.props)} />
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
                    <View style={dstyles.titleSec}>
                        <Text style={dstyles.title}>
                            <ListView
                                style={styles.locations}
                                dataSource={this.state.locations}
                                renderRow={(rowData) =>
                                    <View>
                                        <TouchableOpacity style={styles.wrapper}>
                                            <TBTItem rowData={rowData}/>
                                        </TouchableOpacity>
                                        <View style={styles.separator} />
                                    </View>}
                                enableEmptySections={true}
                                showsVerticalScrollIndicator={false}
                            />
                        </Text>
                    </View>

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
}

module.exports = LocationListViewView;
