'use strict';

/**
 * Created by Daniel on 2/10/2017.
 */

import React, { Component } from 'react';
import { Image, Navigator } from 'react-native';

import { GetLocationList, GetCategoryByName } from 'app/DataManager';

import { GetIcon } from 'app/Assets';
import { styles } from 'app/css';

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

    // Return in feet (converts km to ft)
    function FeetConverter(km){return km * 3280.84;}
    return FeetConverter(haversine([lat,long],[curLat,curLong]));
}

export function popPrioritize(region, categoryName = 'All'){
    const locations = GetLocationList();
    if(!locations) {
        return [];
    }

    const {
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta
    } = region;

    //create rectangular area
    const topLeftCor = {
        lat:latitude-(latitudeDelta/2),
        long:longitude+(longitudeDelta/2)
    };
    const bottomRight = {
        lat:latitude+(latitudeDelta/2),
        long:longitude-(longitudeDelta/2)
    };

    //filter out locations outside of viewport
    var locInView = locations.filter(function(loc){
        if(loc.long > topLeftCor.long ||
            loc.long < bottomRight.long ||
            loc.lat > bottomRight.lat ||
            loc.lat < topLeftCor.lat)
        {
            return false;
        }
        else {
            return true;
        }
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

    //check if category is parking, if so reverse priority (most obscure parking lots to most popular parking lots)
    if(categoryName === 'Parking'){
        results = results.sort(function(a,b){return b.priority-a.priority;});
    }
    else {
        results = results.sort(function(a,b){return a.priority-b.priority;});
    }

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
