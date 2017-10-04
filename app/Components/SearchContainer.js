import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native';

import fuzzy from 'fuzzy';
import SearchBar from 'react-native-searchbar';

import { styles } from 'app/css';
const dirStyles = require( "../../assets/css/directionsStyle");

export default class SearchContainer extends Component {

  static propTypes = {
    locations: PropTypes.array,
    title: PropTypes.string,
    maxResults: PropTypes.number,
    onResultSelect: PropTypes.func,
    searchText: PropTypes.string
  };

  static defaultProps = {
    locations: [],
    title: "Suggestions",
    maxResults: 30,
    onResultSelect: res => console.warn('result clicked (no callback)', res),
    searchText: "Search"
  };

  constructor(props) {
    super(props);

    if (!props.locations) {
      console.error('No "locations" prop provided.');
    }

    this.popularLocations = props.locations
                              .sort((a,b) => a.priority - b.priority)
                              .slice(0, props.maxResults);

    this.state = {
      results: this.popularLocations
    };
  }

  handleSearch = (input) => {
    const { maxResults } = this.props;

    // show popular locations on empty input
    if (input == '') {
      this.setState({
        results: this.popularLocations
      });
    }
    else {
      const results = this.searchByName(input);
      this.setState({
        results: results.slice(0, maxResults)
      });
    }
  }

  searchByName = (input) => {
    const { locations } = this.props;

    let options = {
      extract: loc => loc.name
    };

    const results = fuzzy.filter(input, locations, options);

    return results.map(result => result.original);
  }

  render() {
    const {
      locations,
      title,
      onResultSelect,
    } = this.props;

    return (
        <View style={styles.wrapper}>
          <Text style={{marginTop: 60}}>
          </Text>

          <View style={{marginTop: 60, marginBottom: 15}}>
            {
              this.state.results.map((result, i) => (
                <View style={dirStyles.button}>
                  <Button
                    fontColor='red'
                    key={i}
                    title={result.name}
                    onPress={() => onResultSelect(result)}
                  />
                </View>
              ))
            }
          </View>

          <SearchBar
            ref={(ref) => this.searchBar = ref}
            data={locations}
            handleSearch={this.handleSearch}
            showOnLoad
            hideBack={true}
            placeholder={this.props.searchText}
            heightAdjust={-10}
          />
        </View>
    );
  }
}
