/**
 * Created by danielhuang on 5/26/17.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
} from 'react-native';

const styles = require( "../../assets/css/style");

export default class DetailItem extends Component {

    constructor(props){
        super(props);
        this.state = {
            location:this.props.rowData
        };
    }

    renderImage(){
        switch(this.props.rowData.catID)
        {
            //description
            case 1:
                return(
                    <Image style={styles.placeholder} source={require('../../assets/new_sizes/1.png')}/>
                );
                break;
            //image
            case 2:
                return(
                    <Image style={styles.placeholder} source={require('../../assets/new_sizes/2.png')}/>
                );
                break;
            //parking
            case 3:
                return(
                    <Image style={styles.placeholder} source={require('../../assets/new_sizes/3.png')}/>
                );
                break;
            //menu
            case 4:
                return(
                    <Text></Text>
                );
                break;
            //priority
            case 5:
                return(<Text></Text>);
                break;
            //hours
            case 6:
                return(<Text></Text>);
                break;
        }
    }

    render() {
        return (
            <View style={styles.wrapper}>
                {this.renderImage()}
                <Text style={styles.locText}>
                    {this.props.rowData.loc}{'\n'}
                    <Text style={styles.distText}>
                        {this.props.rowData.dist} feet away
                    </Text>
                </Text>
            </View>
        );
    }
}

module.exports = DetailItem;
