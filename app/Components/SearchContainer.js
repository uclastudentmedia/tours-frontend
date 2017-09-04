import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

import { pick } from 'lodash';

import fuzzy from 'fuzzy';
import SearchBar from 'react-native-searchbar';

const styles = require( "../../assets/css/style");

export default class SearchBarContainer extends Component {

  static propTypes = {
    locations: PropTypes.array,
    title: PropTypes.string,
    numResults: PropTypes.number
  };

  static defaultProps = {
    locations: [],
    title: "Searchbar Title",
    numResults: 30
  };

  constructor(props) {
    super(props);
    this.state = {
      results: []
    };

    if (!props.locations) {
      console.error('No "locations" prop provided.');
    }
  }

  handleSearch = (input) => {
    const { numResults } = this.props;

    const results = this.searchByName(input);
    this.setState({
      results: results.slice(0, numResults)
    });
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
    const { locations, title } = this.props;

    return (
        <View style={styles.wrapper}>
          <Text style={{marginTop: 80}}>
            {title}
          </Text>

          <View style={{marginTop: 110}}>
            {
              this.state.results.map((result, i) => (
                <Text key={i}>
                  {result.name}
                </Text>
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
