import React, { Component } from 'react';
import { Text, View, Navigator, TouchableHighlight, TouchableOpacity } from 'react-native';

class DetailsView extends Component
 {
     render()
     {
         return (
             <Navigator
                 renderScene={this.renderScene.bind(this)}
                 navigator={this.props.navigator}
                 navigationBar={
                   <Navigator.NavigationBar style={{backgroundColor: '#246dd5'}}
                       routeMapper={NavigationBarRouteMapper} />
                 } />
        );
    }

    renderScene(route, navigator) {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
                <TouchableHighlight style={{backgroundColor: 'yellow', padding: 10}}>
                    <Text style={{backgrondColor: 'yellow', color: 'green'}}>下一页</Text>
                </TouchableHighlight>
            </View>
        );
    }
}


var NavigationBarRouteMapper = {
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
          主页
        </Text>
      </TouchableOpacity>
    );
  }
};

module.exports = DetailsView;
