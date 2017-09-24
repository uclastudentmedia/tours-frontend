import React, { Component, PropTypes } from 'react';
import {
    Text,
    View,
    Button,
    ScrollView,
    TouchableHighlight
} from 'react-native';

import fuzzy from 'fuzzy';
import SearchBar from 'react-native-searchbar';

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
        })
      })
    }),
  };

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title || ''}`,
  });

  constructor(props) {
    console.log(props);
    super(props);

    const params = props.navigation.state.params;
    this.onResultSelect = params.onResultSelect;
    this.goBack = params.goBack;
    this.data = params.data || [];
    this.defaultResults = params.defaultResults || this.data;

    if (this.data.length == 0) {
      console.warn('SearchView created with no data.');
    }

    this.maxResults = 30;

    this.state = {
      results: this.defaultResults.slice(0, this.maxResults)
    };
  }

  handleSearch = (input) => {

    if (input == '') {
      this.setState({
        results: this.defaultResults.slice(0, this.maxResults)
      });
    }
    else {
      const results = this.searchByName(input);
      this.setState({
        results: results.slice(0, this.maxResults)
      });
    }
  }

  searchByName = (input) => {

    const results = fuzzy.filter(input, this.data);

    return results.map(result => result.original);
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
            focusOnLayout={false}
            autoCorrect={false}
          />

          <ScrollView>
            <View style={{marginTop: 60, marginBottom: 15}}>
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
            </View>
          </ScrollView>

        </View>
    );
  }
}


