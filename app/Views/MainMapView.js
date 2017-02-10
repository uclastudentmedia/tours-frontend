/**
 * Created by Daniel on 2/9/2017.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    ListView
} from 'react-native';
import MapView from 'react-native-maps';

import LoadingView from './LoadingView';

const styles = require( "../../assets/css/style");

var dataPop = '';

export default class MainMapView extends Component {

    async componentDidMount(){
        try {
            let value = await AsyncStorage.getItem('data');
            let val = JSON.parse(value);
            if(val !== null){
                this.setState({
                    data: val
                });
                dataPop = val.results;
                this.setState({
                    loaded: true
                });
                console.log(dataPop);
            }
        } catch (e) {
            console.log(e);
        }
        console.log(this.state.data);
    }

    constructor(props){
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            data: '',
            dataSource: ds.cloneWithRows(dataPop),
            loaded: false
        }
    }

    static get defaultProps() {
        return {
            title: 'MapView',
        };
    }

    render() {
        if(!this.state.loaded){
            return (
                <LoadingView/>
            );
        }
        else {
            return (
                <View style={styles.container}>
                    <MapView style={styles.map}
                             initialRegion={{
                latitude: 34.070286,
                longitude: -118.443413,
                latitudeDelta: 0.0122,
                longitudeDelta: 0.0921,}}>
                        <MapView.Marker
                            image={require('../../assets/images/pin_1x.png')}
                            coordinate={{
                latitude: 34.070286,
                longitude: -118.443413,
                latitudeDelta: 0.0122,
                longitudeDelta: 0.0921,}}
                        />
                    </MapView>
                    <View style={styles.info}>

                        <ListView
                            dataSource={this.state.dataSource}
                            renderRow={(rowData) => <Text>{rowData}</Text>}
                            enableEmptySections={true}
                        />
                    </View>
                </View>
            );
        }
    }
}
