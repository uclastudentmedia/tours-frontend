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

    this.params = props.navigation.state.params;

    this.locations = GetLocationList();

    this.maxResults = 30;

    this.popularLocations = this.locations
                              .sort((a,b) => a.priority - b.priority)
                              .slice(0, this.maxResults);

    this.state = {
      results: this.popularLocations,
    };
  }

  handleSearch = (input) => {

    // show popular locations on empty input
    if (input == '') {
      this.setState({
        results: this.popularLocations
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

    let options = {
      extract: loc => loc.name
    };

    const results = fuzzy.filter(input, this.locations, options);

    return results.map(result => result.original);
  }

  handleOnResultSelect(loc) {
    this.params.onResultSelect(loc);
    if (this.params.goBack !== false) {
      this.props.navigation.goBack();
    }
  }

  render() {

    return (
        <View style={styles.wrapper}>

          <SearchBar
            ref={(ref) => this.searchBar = ref}
            data={this.locations}
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
                this.state.results.map(loc => (
                  <View key={loc.id}>
                    <TouchableHighlight
                      underlayColor="#DDDDDD"
                      style={DirectionsStyle.button}
                      onPress={this.handleOnResultSelect.bind(this, loc)}>

                      <Text style={DirectionsStyle.buttonText}>{loc.name}</Text>

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


