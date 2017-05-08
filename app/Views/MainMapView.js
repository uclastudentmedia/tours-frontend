/**
 * Created by Daniel on 2/9/2017.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    ListView,
    TouchableHighlight,
    Dimensions,
    PanResponder,
    Animated,
    Image,
    TouchableOpacity,
    Navigator,
    TextInput,
    Button,
} from 'react-native';
import MapView from 'react-native-maps';
import {DistancePrioritize,popPrioritize,LocToData,LocToIcon} from '../Utils'

import ListItem from '../Components/ListItem';
import SlidingUpPanel from 'react-native-sliding-up-panel';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import { Kohana } from 'react-native-textinput-effects';


const styles = require( "../../assets/css/style");
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var {height, width} = Dimensions.get('window');
var dataPop = [];
var loaded = false;
var initialPosition = {};
var mapSettinger=1;
var val = {};
var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;
var region: {
    latitude: 34.070286,
    longitude: -118.443413,
    latitudeDelta: 0.0045,
    longitudeDelta: 0.0345,
};
var polyLine: [
    {latitude: 34.071335, longitude: -118.441864},
    {latitude: 34.068822, longitude: -118.441349}
];

export default class MainMapView extends Component {

    watchID: ?number = null;

    componentWillMount(){
        this.setupData();
    }

    componentDidMount() {
        setInterval(function(){
            this.setupData();
        }.bind(this), 10000);

        this.setState({
            dataSource: ds.cloneWithRows(dataPop),
            region: {
                latitude: 34.070286,
                longitude: -118.443413,
                latitudeDelta: 0.0045,
                longitudeDelta: 0.0345,
            },
        });
    }

    setupData(){
        this.getData();
        this.getPosition();
    }

    async getData(){
        try {
            let value = await AsyncStorage.getItem('data');
            val = JSON.parse(value);
            if(val !== null){
                console.log("initialposition",initialPosition);
                console.log("region",this.state.region);
                this.setState({
                    data: val
                });
                var temp;
                if(mapSettinger===2){
                    //if map setting is tours, display locations on the tour
                }
                else if(mapSettinger===0){
                    //if map setting is nearby, prioritize top 10 location by distance
                    temp = DistancePrioritize(initialPosition.coords.latitude, initialPosition.coords.longitude, value);
                }
                else{
                    //if map setting is campus map. prioritize top 10 locations by popularity/category
                    //this is default
                    temp = popPrioritize(value,initialPosition.coords.latitude, initialPosition.coords.longitude,
                        0.0045, 0.0345);
                }
                //temp = DistancePrioritize(initialPosition.coords.latitude, initialPosition.coords.longitude, value).slice(0,10);
                dataPop = [];
                markersTemp=[[{lat:34.070286,long:-118.443413,src:""}]];
                for(var i = 0; i < temp.length; i++)
                {
                    //push location data onto data
                    var locData = {loc:"", dist:0,icon_src:""};
                    var distance = Math.round(temp[i].distanceAway);
                    locData.loc = temp[i].location;
                    locData.dist = distance;
                    locData.imSrc=temp[i].imgSrc;
                    dataPop.push(locData);

                    //push coordinate data into this.markers
                    var markersData = {lat:0,long:0,src:""};
                    markersData.lat= temp[i].lat;
                    markersData.long= temp[i].long;
                    //console.log("markers category: " + temp[i].category);
                    markersData.src=temp[i].imgSrc;
                    markersTemp.push(markersData);
                }
                markersTemp.splice(0,1);
                markersTemp.slice(0,10);
                this.setState({
                    dataSource: ds.cloneWithRows(dataPop),
                    markers:markersTemp
                });
                console.log(this.state.markers);
                loaded = true;
            }
        } catch (e) {
            console.log(e);
        }
    }

    getPosition(){
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var initialPosition2 = JSON.stringify(position);
                var val = JSON.parse(initialPosition2);
                initialPosition = val;
            },
            (error) => alert(JSON.stringify(error)),
            {enableHighAccuracty: true, timeout: 2000000, maximumAge: 500}
        );
        this.watchID = navigator.geolocation.watchPosition((position) => {
            var lastPosition = JSON.stringify(position);
            var val = JSON.parse(lastPosition);
            this.setState({lastPosition: val});
        });
    }

    componentWillUnmount(){
        navigator.geolocation.clearWatch(this.watchID);
    }

    constructor(props){
        super(props);
        this.state = {
            data: '',
            dataSource: ds.cloneWithRows(dataPop),
            lastPosition: 'unknown',
            markers:[{lat:34.070286,long:-118.443413,src:""}],
            region: {
                latitude: 34.070286,
                longitude: -118.443413,
            },
        }
    }
    getInitialState() {
        return {
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
        };
    }
    onRegionChange(region1) {
        this.setState(region: region1);
    }
    changeMapSetting(setting){

        mapSettinger=setting;
        this.getData();
    }
    gotoDescription(rowData){
        let id = LocToData(rowData.loc, val);
        this.props.navigator.push({
            id: 'Details',
            name: 'More Details',
            rowDat: rowData,
            locID: id,
        });
    }

    renderDragMenu(){
        return (
            <View style={styles.info}>
                {/*
                <View style={{alignItems: 'center', width: width, height: 30, backgroundColor: 'yellow'}}>
                <Image
                     source={require('../../assets/images/handle.png')}/>
                </View>
                */}
                <ListView
                    style={styles.locations}
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) =>
                        <View>
                            <TouchableOpacity onPress={this.gotoDescription.bind(this, rowData)} style={styles.wrapper}>
                                <ListItem imageSrc={{uri:'../../assets/images/icon_ph.png'}} rowData={rowData}/>
                            </TouchableOpacity>
                            <View style={styles.separator} />
                        </View>}
                    enableEmptySections={true}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        );
    }

    render() {
        if(loaded && initialPosition != 'unknown'){
            return (
                <View style={styles.container}>
                    <View style={styles.inputWrapper1}>
                    {
                      /*  <TextInput
                            style={styles.input}
                            placeholder="Start Destination"
                            underlineColorAndroid="transparent"
                            placeholderTextColor="#adadad"
                        />*/
                    }
                      <Kohana
                        style={{ backgroundColor: '#6495ed' }}
                        label={'Tap to Search'}
                        iconClass={MaterialsIcon}
                        iconName={'search'}
                        iconColor={'white'}
                        labelStyle={{ color: 'white' }}
                        inputStyle={{ color: 'white' }}
                      />
                    </View>
                    <View style={styles.btnContainer}>
                        <Button
                            onPress={()=>this.changeMapSetting(0)}
                            title="Nearby"
                            accessibilityLabel="Learn more about this purple button"
                            style={styles.button}
                        />
                        <Button
                            onPress={()=>this.changeMapSetting(1)}
                            title="Campus"
                            accessibilityLabel="Learn more about this purple button"
                            style={styles.button}
                        />
                        <Button
                            onPress={()=>this.changeMapSetting(2)}
                            title="Tours"
                            accessibilityLabel="Learn more about this purple button"
                            style={styles.button}
                        />
                    </View>
                    <MapView style={styles.map}
                        region={this.state.region}
                         zoomEnabled
                             onRegionChangeComplete={(region) => this.setState({ region })}
                        >
                        <MapView.Marker
                            image={require('../../assets/images/dot1.png')}
                            coordinate={{
                                latitude: initialPosition.coords.latitude,
                                longitude: initialPosition.coords.longitude
                            }}
                        />
                        <MapView.Polyline
                            coordinates={[
                                {latitude: 34.072872, longitude: -118.441136},
                                {latitude: 34.074685, longitude: -118.441416}
                            ]}
                            strokeWidth={3}
                        />
                        <MapView.Marker
                            coordinate={{
                                latitude: 34.072872,
                                longitude: -118.441136
                            }}
                            title={"Haines Hall"}
                            description={"Land of Smallberg"}
                        />
                        <MapView.Marker
                            coordinate={{
                                latitude:34.074685,
                                longitude:-118.441416
                            }}
                            color={'#000000'}
                            title={"YRL"}
                            description={"I only go here to work on startup"}
                        />
                        {this.state.markers.map(marker => (
                            <MapView.Marker
                                image={require('../../assets/images/dot1.png')}
                                coordinate={{
                                    latitude:marker.lat,
                                    longitude:marker.long,
                                }}
                                title={marker.location}
                                description={marker.description}
                            />
                        ))}
                    </MapView>
                    <SlidingUpPanel
                        containerMaximumHeight={deviceHeight - 100}
                        handlerBackgroundColor={'rgba(0,0,0,0)'}
                        handlerHeight={33}
                        allowStayMiddle={true}
                        handlerDefaultView={<HandlerOne/>}>
                            {this.renderDragMenu()}
                     </SlidingUpPanel>

                </View>
            );
        }
        else {
            return (
                <View style={styles.loadMapContainer}>
                    <MapView style={styles.map}
                             region={this.state.region}
                             >
                        <MapView.Marker
                            image={require('../../assets/images/dot1.png')}
                            coordinate={{
                                latitude: 34.070984,
                                longitude: -118.444759
                            }}/>
                    </MapView>
                    <View style={styles.info}>
                        <Text style={styles.loadingLocText}>
                            Loading Data...
                        </Text>
                        <Text style={styles.loadingDistText}>
                            We are loading your location data
                        </Text>
                    </View>
                </View>
            );
        }
    }
}
//<Image style={styles.image} source={require('../../assets/images/drag_bar.png')}>
//</Image>
class HandlerOne extends Component{
    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.image} source={require('../../assets/images/drag_bar.png')}>
                    </Image>
            </View>
        );
    }
};