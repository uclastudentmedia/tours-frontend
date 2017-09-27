'use strict';

import React, { Component, PropTypes } from 'react';
import TransformableImage from 'react-native-transformable-image';

import { styles } from 'app/css';

export default class ImageView extends Component
{
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          imageUrl: PropTypes.string.isRequired,
          title: PropTypes.string,
        })
      })
    }),
  };

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`,
  });

  constructor(props) {
    super(props);
    this.imageUrl = props.navigation.state.params.imageUrl;
  }

  render() {
    return (
      <TransformableImage
        source={{uri: this.imageUrl}}
        style={styles.container}
      />
  );
  }
}
