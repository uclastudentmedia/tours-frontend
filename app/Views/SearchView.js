import React, { Component, PropTypes } from 'react';
import {
    Text,
    View,
    Button,
    ScrollView,
    TouchableHighlight
} from 'react-native';

import Fuse from 'fuse.js';
import SearchBar from 'react-native-searchbar';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';

import GPSManager from 'app/GPSManager';
import { Location } from 'app/DataTypes';
import { GetLocationList } from 'app/DataManager';

import {
  styles,
  DirectionsStyle
} from 'app/css';

export default class SearchView extends Component {

  static propTypes = {
    screenProps: PropTypes.shape({
      GPSManager: PropTypes.instanceOf(GPSManager).isRequired,
    }),
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          onResultSelect: PropTypes.func.isRequired,
          title: PropTypes.string,
          data: PropTypes.arrayOf(PropTypes.string),
          defaultResults: PropTypes.arrayOf(PropTypes.string),

          // set to false if you want SearchView to stay on the navigation stack
          goBack: PropTypes.bool,

          // special items that have a icon
          dataWithIcons: PropTypes.arrayOf(PropTypes.shape({
            text: PropTypes.string,
            icon: PropTypes.string
          }))
        })
      })
    }),
  };

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title || ''}`,
  });

  constructor(props) {
    super(props);

    const params = props.navigation.state.params;
    this.onResultSelect = params.onResultSelect;
    this.goBack = params.goBack;
    this.data = params.data || [];
    this.dataWithIcons = params.dataWithIcons || [];
    this.defaultResults = params.defaultResults || this.data;

    if (this.data.length == 0) {
      console.warn('SearchView created with no data.');
    }

    this.maxResults = 30;

    this.state = {
      results: this.defaultResults.slice(0, this.maxResults)
    };

    this.fuse = new Fuse(this.data, {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 64,
      minMatchCharLength: 2,
    });
  }

  handleSearch = (input) => {
    if (input == '') {
      this.setState({
        results: this.defaultResults.slice(0, this.maxResults)
      });
    }
    else {
      const results = this.fuse.search(input)
                          .slice(0, this.maxResults)
                          .map(idx => this.data[idx]);

      this.setState({
        results: results
      });
    }
  }

  handleOnResultSelect(loc) {
    this.onResultSelect(loc);
    if (this.goBack !== false) {
      this.props.navigation.goBack();
    }
  }

  render() {

    return (
        <View style={styles.wrapper}>

          <SearchBar
            ref={(ref) => this.searchBar = ref}
            data={this.data}
            handleSearch={this.handleSearch}
            showOnLoad
            hideBack={true}
            heightAdjust={-10}
            focusOnLayout={true}
            autoCorrect={false}
          />

          <ScrollView keyboardShouldPersistTaps={'always'}>
            <View style={styles.searchViewDataWithIcons}/>
            {
              this.dataWithIcons.map((item, i) => (
                <View key={i}>
                  <TouchableHighlight
                    underlayColor="#DDDDDD"
                    style={DirectionsStyle.button}
                    onPress={this.handleOnResultSelect.bind(this, item.text)}
                  >
                    <View style={[styles.flexRow]}>
                      <MaterialsIcon color='#2af' size={24} name={item.icon}/>
                      <View style={{width: 20}}/>
                      <Text style={DirectionsStyle.buttonText}>
                        {item.text}
                      </Text>
                    </View>
                  </TouchableHighlight>
                </View>
              ))
            }
            <View style={styles.searchViewData}/>
            {
              this.state.results.map((item, i) => (
                <View key={i}>
                  <TouchableHighlight
                    underlayColor="#DDDDDD"
                    style={DirectionsStyle.button}
                    onPress={this.handleOnResultSelect.bind(this, item)}
                  >
                    <Text style={DirectionsStyle.buttonText}>{item}</Text>
                  </TouchableHighlight>
                </View>
              ))
            }
            <View style={styles.ScrollViewBottom}/>
          </ScrollView>

        </View>
    );
  }
}


