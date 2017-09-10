/**
 * Created by Daniel on 2/10/2017.
 */

import React, { Component } from 'react';
import { Image, Navigator } from 'react-native';

import { GetIcon } from 'app/Assets';

const styles = require( "../assets/css/style");
const dstyles= require('../assets/css/detailStyle');

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

export function popPrioritize(val,lat,long,latD,longD){
    if(!val) {
        return [];
    }
    //console.log("pop prioritize");
    // We have data!!
    //create rectangular area
    //est topLeft and bottomRight long/lat based on long,lat, long delta, and lat delta
    topLeftCor = {
        lat:lat-(latD/2),
        long:long+(longD/2)
    };
    bottomRight = {
        lat:lat+(latD/2),
        long:long-(longD/2)
    };

    //filter out locations outside of viewport
    var locInView=[];
    //sort everything in val
    var tempRes=val.sort(function(a,b){return a.priority-b.priority;});

    //loop through all locations to filter by: zoom level

    tempRes=tempRes.filter(function(loc){
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

    //save top 10 results to locInView
    for(var i = 0; i < 10 && i < tempRes.length; i++){
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
    return locInView.slice(0, 10);
}

export function DistancePrioritize(currentLat,currentLong, val){
    if (!val) {
        return [];
    }
    var DistAway = [];
    for(var i = 0; i<val.length; i++){
        DistAway.push({
            location:val[i].name,
            distanceAway:feetCalc(currentLat, currentLong,
                                  val[i].lat, val[i].long),
            lat:val[i].lat,
            long:val[i].long,
            category:val[i].category_id,
        });
    }
    DistAway.sort(function(a,b){
        if(a.distanceAway<b.distanceAway){
            return -1;
        }
        if(a.distanceAway>b.distanceAway){
            return 1;
        }
        return 0;
    });
    return DistAway.slice(0,10);
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
        styleClass=dstyles.icon;
    }
    else{
        styleClass=styles.placeholder;
    }

    return (
        <Image style={styleClass} source={GetIcon(category)}/>
    );
}
