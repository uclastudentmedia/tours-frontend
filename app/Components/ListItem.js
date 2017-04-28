/**
 * Created by Daniel on 2/9/2017.
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

export default class ListItem extends Component {

    render() {
        return (
            <View style={styles.wrapper}>
                <Image style={styles.placeholder} source={this.props.imageSrc}/>
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
