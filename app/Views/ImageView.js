'use strict';

import React, { Component, PropTypes } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import TransformableImage from 'react-native-transformable-image';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';

import { styles } from 'app/css';

export default class ImageView extends Component
{
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          images: PropTypes.arrayOf(PropTypes.shape({
            url: PropTypes.string.isRequired,
            floor: PropTypes.string.isRequired,
          })).isRequired,
        })
      })
    }),
  };

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`,
  });

  constructor(props) {
    super(props);
    this.images = props.navigation.state.params.images;

    if (this.images.length == 0) {
      return;
    }

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

  render() {
    const {
      index,
    } = this.state;

    const image = this.images[index];

    return (
      <View style={styles.container}>
        <Text>{image.floor}</Text>
        <TransformableImage
          source={{uri: image.url}}
          style={{flex:1, height: 300, width: 300}}
        />
        <TouchableOpacity style={{flex:1}} onPress={this.prev}>
          <MaterialsIcon color={this.hasPrev() ? '#00f' : '#888'} size={30} name={'arrow-back'}/>
        </TouchableOpacity>
        <TouchableOpacity style={{flex:1}} onPress={this.next}>
          <MaterialsIcon color={this.hasNext() ? '#00f' : '#888'} size={30} name={'arrow-forward'}/>
        </TouchableOpacity>
      </View>
  );
  }
}
