/**
 * Created by danielhuang on 9/2/17.
 */
import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';

import {
  TBTItem,
} from 'app/Components';

const styles = require( "../../assets/css/style");

export default class DirectionsView extends Component
{
  constructor(props){
    super(props);
    this.state = {
      results: '',
      loaded: true,
    }
  }
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
                console.log(this.props.navigator);
                this.props.navigator.pop();
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

  render() {
    console.log("DirectionsView");
    return (
      <View style={styles.container}>
        <Text style={styles.title}>This is the Directions View</Text>
      </View>
    );
  }
}
module.exports = DirectionsView;