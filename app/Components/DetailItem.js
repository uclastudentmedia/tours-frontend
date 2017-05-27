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

export default class detailItem extends Component {

    constructor(props){
        super(props);
        this.state = {
            location:this.props.rowData
        };
    }

    renderImage(){
        switch(this.props.rowData.catID)
        {
            case 1:
                return(
                    <Image style={styles.placeholder} source={require('../../assets/loc_icons/1.png')}/>
                );
                break;
            case 2:
                return(
                    <Image style={styles.placeholder} source={require('../../assets/loc_icons/2.png')}/>
                );
                break;
            case 3:
                return(
                    <Image style={styles.placeholder} source={require('../../assets/loc_icons/3.png')}/>
                );
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

module.exports = ListItem;
