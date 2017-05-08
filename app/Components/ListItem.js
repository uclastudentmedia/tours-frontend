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

    constructor(props){
        super(props);
        this.state = {
            cateID: this.props.rowData.catID
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
                break;
            case 4:
                return(
                    <Image style={styles.placeholder} source={require('../../assets/loc_icons/4.png')}/>
                );
                break;
            // case 5:
            //     return(
            //         <Image style={styles.placeholder} source={require('../../assets/loc_icons/5.png')}/>
            //     );
            case 6:
                return(
                    <Image style={styles.placeholder} source={require('../../assets/loc_icons/6.png')}/>
                );
                break;
            case 7:
                return(
                    <Image style={styles.placeholder} source={require('../../assets/loc_icons/7.png')}/>
                );
                break;
            case 8:
                return(
                    <Image style={styles.placeholder} source={require('../../assets/loc_icons/8.png')}/>
                );
                break;
            case 9:
                return(
                    <Image style={styles.placeholder} source={require('../../assets/loc_icons/9.png')}/>
                );
                break;
            case 10:
                return(
                    <Image style={styles.placeholder} source={require('../../assets/loc_icons/10.png')}/>
                );
                break;
            case 11:
                return(
                    <Image style={styles.placeholder} source={require('../../assets/loc_icons/11.png')}/>
                );
                break;
            case 12:
                return(
                    <Image style={styles.placeholder} source={require('../../assets/loc_icons/12.png')}/>
                );
                break;
            case 13:
                return(
                    <Image style={styles.placeholder} source={require('../../assets/loc_icons/13.png')}/>
                );
                break;
            case 14:
                return(
                    <Image style={styles.placeholder} source={require('../../assets/loc_icons/14.png')}/>
                );
                break;
            case 15:
                return(
                    <Image style={styles.placeholder} source={require('../../assets/loc_icons/15.png')}/>
                );
                break;
            // case 16:
            //     return(
            //         <Image style={styles.placeholder} source={require('../../assets/loc_icons/16.png')}/>
            //     );
            // case 17:
            //     return(
            //         <Image style={styles.placeholder} source={require('../../assets/loc_icons/17.png')}/>
            // );
            case 18:
                return(
                    <Image style={styles.placeholder} source={require('../../assets/loc_icons/18.png')}/>
                );
                break;
            case 20:
                return(
                    <Image style={styles.placeholder} source={require('../../assets/loc_icons/20.png')}/>
                );
                break;
            case 61:
                return(
                    <Image style={styles.placeholder} source={require('../../assets/loc_icons/61.png')}/>
                );
                break;
            case 321:
                return(
                    <Image style={styles.placeholder} source={require('../../assets/loc_icons/321.png')}/>
                );
                break;
            case 961:
                return(
                    <Image style={styles.placeholder} source={require('../../assets/loc_icons/961.png')}/>
                );
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

module.exports = ListItem;
