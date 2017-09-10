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

import { styles } from 'app/css';

export default class TBTItem extends Component {

    constructor(props){
        super(props);
        console.log(this.props.rowData);
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <Text style={styles.locText}>
                    {this.props.rowData.verbal_pre_transition_instruction}{'\n'}
                    {this.props.rowData.verbal_post_transition_instruction}
                </Text>
            </View>
        );
    }
}
