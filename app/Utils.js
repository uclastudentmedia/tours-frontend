'use strict';

/**
 * Created by Daniel on 2/10/2017.
 */

import React, { Component } from 'react';
import { Image, Navigator } from 'react-native';

import { GetLocationList, GetCategoryByName } from 'app/DataManager';

import { GetIcon } from 'app/Assets';
import { styles, DetailStyle } from 'app/css';

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

export function popPrioritize(lat,long,latD,longD, categoryName = 'All'){
    const locations = GetLocationList();
    if(!locations) {
        return [];
    }

    //create rectangular area
    //est topLeft and bottomRight long/lat based on long,lat, long delta, and lat delta
    const topLeftCor = {
        lat:lat-(latD/2),
        long:long+(longD/2)
    };
    const bottomRight = {
        lat:lat+(latD/2),
        long:long-(longD/2)
    };

    console.log(topLeftCor, bottomRight);
    console.log(locations[0]);

    //filter out locations outside of viewport
    var locInView=[];
    //loop through all locations to filter by: zoom level
    var tempRes = locations.filter(function(loc){
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

    //check if category is parking, if so reverse priority (most obscure parking lots to most popular parking lots)
    if(categoryName === 'Parking'){
        tempRes=tempRes.sort(function(a,b){return b.priority-a.priority});
    }
    else {
        tempRes=tempRes.sort(function(a,b){return a.priority-b.priority;});
    }

    if (categoryName === 'All') {
        for(let i=0; i<tempRes.length;i++){
            locInView.push({
                location: tempRes[i].name,
                lat: tempRes[i].lat,
                long: tempRes[i].long,
                rank: tempRes[i].priority,
                distanceAway: feetCalc(lat,long,tempRes[i].lat,tempRes[i].long),
                category: tempRes[i].category_id,
                id: tempRes[i].id
            });
        }
    } else {
        //list locations depending on what location category was called
        for(let i=0; i<tempRes.length;i++){
            //Select for food category and displays food locations within 800 feet
            if(tempRes[i].category_id === category.id ){
                locInView.push({
                    location: tempRes[i].name,
                    lat: tempRes[i].lat,
                    long: tempRes[i].long,
                    rank: tempRes[i].priority,
                    distanceAway: feetCalc(lat,long,tempRes[i].lat,tempRes[i].long),
                    category: tempRes[i].category_id,
                    id: tempRes[i].id
                });
            }
        }
    }

    return locInView.slice(0, 10);
}

export function DistancePrioritize(currentLat, currentLong) {
    const locations = GetLocationList();
    if (!locations) {
        return [];
    }

    var DistAway = locations.map(loc => {
        return {
          loc: loc,
          distanceAway:feetCalc(currentLat, currentLong,
                                loc.lat, loc.long),
        };
    });
    DistAway.sort((a,b) => {
      return a.distanceAway - b.distanceAway;
    });

    return DistAway.slice(0,10).map(obj => obj.loc);
}

//given a location name (string), returns data object
export function LocToData(location,data){
      if(data) {
          return data.find(function(loc){return loc.name === location});
      }
      return null;
}

export function RenderIcon(category, view) {
    let styleClass;
    if(view==='details'){
        styleClass=DetailStyle.icon;
    }
    else{
        styleClass=styles.placeholder;
    }

    return (
        <Image style={styleClass} source={GetIcon(category)}/>
    );
}
