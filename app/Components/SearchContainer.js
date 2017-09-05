import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native';

import fuzzy from 'fuzzy';
import SearchBar from 'react-native-searchbar';

const styles = require( "../../assets/css/style");

export default class SearchContainer extends Component {

  static propTypes = {
    locations: PropTypes.array,
    title: PropTypes.string,
    maxResults: PropTypes.number,
    onResultSelect: PropTypes.func,
  };

  static defaultProps = {
    locations: [],
    title: "Searchbar Title",
    maxResults: 30,
    onResultSelect: res => console.warn('result clicked (no callback)', res)
  };

  constructor(props) {
    super(props);

    const { locations, maxResults } = this.props;

    if (!props.locations) {
      console.error('No "locations" prop provided.');
    }

    this.popularLocations = props.locations
                              .sort((a,b) => a.priority - b.priority)
                              .slice(0, maxResults);

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
          <Text style={{marginTop: 80}}>
            {title}
          </Text>

          <View style={{marginTop: 110}}>
            {
              this.state.results.map((result, i) => (
                <Button
                  key={i}
                  title={result.name}
                  onPress={() => onResultSelect(result)}
                />
              ))
            }
          </View>

          <SearchBar
            ref={(ref) => this.searchBar = ref}
            data={locations}
            handleSearch={this.handleSearch}
            showOnLoad
          />
        </View>
    );
  }
}
