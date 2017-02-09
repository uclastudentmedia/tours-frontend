import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
const styles = require( "../../assets/css/style");

export default class App extends Component {
    render() {
        return (
            <View style={styles.container}>
              <Text>Loading ... </Text>
            </View>
        );
    }
}
