'use strict';

import React, { Component, PropTypes } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Alert,
} from 'react-native';
import TransformableImage from 'react-native-transformable-image';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { styles } from 'app/css';

export default class ImageView extends Component
{
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          images: PropTypes.arrayOf(PropTypes.shape({
            url: PropTypes.string.isRequired,
            title: PropTypes.string,
          })).isRequired,
          title: PropTypes.string,
        })
      })
    }),
  };

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title || ''}`,
  });

  constructor(props) {
    super(props);
    this.images = props.navigation.state.params.images;

    this.state = {
      index: 0,
    }
  }

  hasPrev = () => {
    return this.state.index > 0;
  }

  hasNext = () => {
    return this.state.index < this.images.length - 1;
  }

  prev = () => {
    if (this.hasPrev()) {
      this.setState({
        index: this.state.index - 1
      });
    }
  }

  next = () => {
    if (this.hasNext()) {
      this.setState({
        index: this.state.index + 1
      });
    }
  }

  arrowColor = (active) => {
    const activeColor = '#06c';
    const inactiveColor = '#ccc';

    return active ? activeColor : inactiveColor;
  };

  render() {
    const {
      index,
    } = this.state;

    if (this.images.length == 0) {
      // error
      return (
        <View>
          <Text style={styles.errorText}>No images available.</Text>
        </View>
      );
    }

    const image = this.images[index];

    return (
      <View style={styles.container}>

        <TransformableImage
          source={{uri: image.url}}
          style={styles.container}
        />

        <View style={styles.imageBar}>
          <TouchableOpacity style={styles.imageBarArrow} onPress={this.prev}>
            <MaterialIcon color={this.arrowColor(this.hasPrev())} size={30} name='arrow-back'/>
          </TouchableOpacity>

          <Text style={[styles.baseText, styles.imageBarText]}>{image.title}</Text>

          <TouchableOpacity style={styles.imageBarArrow} onPress={this.next}>
            <MaterialIcon color={this.arrowColor(this.hasNext())} size={30} name='arrow-forward'/>
          </TouchableOpacity>
        </View>

      </View>
  );
  }
}
