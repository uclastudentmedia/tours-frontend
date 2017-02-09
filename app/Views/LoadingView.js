import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
const styles = require( "../../assets/css/style");

export default class App extends Component {
    render() {
        return (
            <View style={styles.loading}>
                <Image
                    style={styles.loading_logo}
                    source={require('../../assets/images/logo_1x.png')}/>
              <Text style={styles.center}>Loading ... </Text>
            </View>
        );
    }
}
