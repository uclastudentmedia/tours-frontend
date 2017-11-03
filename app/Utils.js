'use strict';

/**
 * Created by Daniel on 2/10/2017.
 */

import React, { Component } from 'react';
import {
  Image,
  Navigator,
  Alert,
} from 'react-native';

import { GetLocationList, GetCategoryByName } from 'app/DataManager';
import { Location } from 'app/DataTypes';

import { GetIcon } from 'app/Assets';
import { styles } from 'app/css';

// conversions
export function km2ft(km) { return km * 3280.84; }
export function mi2ft(mi) { return mi * 5280; }
export function ft2mi(ft) { return ft / 5280; }

export function feetCalc(lat,long,curLat,curLong){
    // haversine :: (Num, Num) -> (Num, Num) -> Num
    let haversine = ([lat1, lon1], [lat2, lon2]) => {
        // Math lib function names
        let [pi, asin, sin, cos, sqrt, pow, round] =
                ['PI', 'asin', 'sin', 'cos', 'sqrt', 'pow', 'round']
                    .map(k => Math[k]),

            // degrees as radians
            [rlat1, rlat2, rlon1, rlon2] = [lat1, lat2, lon1, lon2]
                .map(x => x / 180 * pi),

            dLat = rlat2 - rlat1,
            dLon = rlon2 - rlon1,
            radius = 6372.8; // km

        // km
        return round(
                radius * 2 * asin(
                    sqrt(
                        pow(sin(dLat / 2), 2) +
                        pow(sin(dLon / 2), 2) *
                        cos(rlat1) * cos(rlat2)
                    )
                ) * 100
            ) / 100;
    };

    // Return in feet
    return km2ft(haversine([lat,long],[curLat,curLong]));
}

export function inRegion(region, latitude, longitude) {

  //create rectangular area
  const minLat = region.latitude  - (region.latitudeDelta  / 2);
  const maxLat = region.latitude  + (region.latitudeDelta  / 2);
  const minLon = region.longitude - (region.longitudeDelta / 2);
  const maxLon = region.longitude + (region.longitudeDelta / 2);

  return (
    latitude  > minLat &&
    latitude  < maxLat &&
    longitude > minLon &&
    longitude < maxLon
  );
}

export function popPrioritize(region, categoryName = 'All'){
    const locations = GetLocationList();
    if(!locations) {
        return [];
    }

    //filter out locations outside of viewport
    var locInView = locations.filter(loc => {
      return inRegion(region, loc.lat, loc.long);
    });

    //check if category filter exists, if it doesn't, set category to all
    const category = GetCategoryByName(categoryName);
    if (category === null) {
        categoryName = 'All';
    }

    var results = [];

    if (categoryName === 'All') {
        results = locInView;
    } else {
        //filter locations by category
        results = locInView.filter(loc => loc.category_id == category.id);
    }

    // sort by priority
    results = results.sort((a,b) => a.priority-b.priority);

    return results;
}

export function DistancePrioritize(currentLat, currentLong) {
    const locations = GetLocationList();
    if (!locations) {
        return [];
    }

    const currentPosition = {
      latitude: currentLat,
      longitude: currentLong
    };

    var results = locations.sort((a,b) => {
      return a.FeetAway(currentPosition) - b.FeetAway(currentPosition);
    });

    return results;
}

export function DecodePolyline(str, precision) {
    var index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, precision || 6);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
}

export function DistanceAwayText(feetAway) {
  if (feetAway <= mi2ft(0.4)) { // ~2000 ft
    feetAway = Math.round(feetAway/10) * 10; // round to 10's
    return `${feetAway} feet away`;
  }
  else {
    // convert to miles
    let milesAway = ft2mi(feetAway);
    milesAway = milesAway.toFixed(1); // round to 0.1's
    return `${milesAway} miles away`;
  }
}

export const CURRENT_LOCATION_ID = -12345; // unique id
export function GetCurrentLocationObject(position) {
  /**
   * @return Location the current GPS location
   */

  position = { latitude: 34.070286, longitude: -118.443413 };
  if (!position) {
    Alert.alert('Unable to find your location.');
    return;
  }

  return new Location({
    lat: position.latitude,
    long: position.longitude,
    name: 'Current Location',
    id: CURRENT_LOCATION_ID,
    category_id: CURRENT_LOCATION_ID,
  });
}
