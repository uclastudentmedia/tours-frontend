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

import { RenderIcon } from 'app/Utils';

const styles = require( "../../assets/css/style");

export default class DetailItem extends Component {

    constructor(props){
        super(props);
        this.state = {
            location:this.props.rowData
        };
    }

    render() {
        return (
            <View style={styles.wrapper}>
                {RenderIcon(this.props.rowData.category_id)}
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
