'use strict';

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

import { renderImage } from 'app/Utils';

const styles = require( "../../assets/css/style");

export default class ListItem extends Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <View style={styles.wrapper}>
                {renderImage(this.props.rowData.catID)}
                <Text style={styles.baseText}>
                    <Text style={styles.locText}>
                        {this.props.rowData.loc}{'\n'}
                        <Text style={styles.distText}>
                            {this.props.rowData.dist} feet away
                        </Text>
                    </Text>
                </Text>
            </View>
        );
    }
}
