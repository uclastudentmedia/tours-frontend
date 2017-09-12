import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
} from 'react-native';

import fuzzy from 'fuzzy';
import SearchBar from 'react-native-searchbar';

import {
  styles,
  DirectionsStyle
} from 'app/css';

export default class SearchContainer extends Component {

  static propTypes = {
    locations: PropTypes.array,
    maxResults: PropTypes.number,
    onResultSelect: PropTypes.func,
    searchText: PropTypes.string
  };

  static defaultProps = {
    locations: [],
    maxResults: 5,
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
      results: this.popularLocations,
      resultsVisible: false,
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

  onFocus = () => {
    //console.log('onfocus');
    this.setState({ resultsVisible: true });
  }

  onBlur = () => {
    //console.log('onblur');
    this.setState({ resultsVisible: false });
  }

  onResultSelect(location) {
    this.props.onResultSelect(location);

    // fill the text input with the selected result
    // WARNING: calling private function, so this may break if
    // react-native-searchbar is upgraded
    this.searchBar._onChangeText(location.name);
  }

  render() {
    const {
      locations,
      searchText,
    } = this.props;

    const {
      results,
      resultsVisible,
    } = this.state;

    return (
        <View style={styles.wrapper}>

          <SearchBar
            ref={(ref) => this.searchBar = ref}
            data={locations}
            handleSearch={this.handleSearch}
            showOnLoad
            hideBack={true}
            placeholder={searchText}
            heightAdjust={-10}
            focusOnLayout={false}
            autoCorrect={false}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
          />

          <View style={{marginTop: 60, marginBottom: 15}}>
            {
              resultsVisible ?
              (
                results.map((loc, i) => (
                  <View
                    style={DirectionsStyle.button}
                    key={loc.id}
                  >
                    <Button
                      fontColor='red'
                      title={loc.name}
                      onPress={this.onResultSelect.bind(this, loc)}
                    />
                  </View>
                ))
              )
              : null
            }
          </View>

        </View>
    );
  }
}
