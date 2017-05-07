/**
 * Created by Daniel on 2/10/2017.
 */

import React, { Component } from 'react';
import {
    AsyncStorage
} from 'react-native';

export function popPrioritize(data,lat,long,latD,longD){
    try{
        const value=data;
        if(value!==null){
            //console.log("pop prioritize");
            // We have data!!
            let val = JSON.parse(value);
            catRank={
                1010:24,
                1011:23,
                1018:22,
                1015:21,
                1003:20,
                1002:19,
                1008:18,
                1014:17,
                1001:16,
                1017:15,
                1009:14,
                1013:13,
                1321:12,
                2285:11,
                1006:10,
                1005:9,
                1012:8,
                1007:7,
                1020:6,
                1016:5,
                1004:4,
                1019:3,
                1961:2,
                2286:1
            };
            //create rectangular area
            //est topLeft and bottomRight long/lat based on long,lat, long delta, and lat delta
            topLeftCor={
                lat:lat+(latD*2),
                long:long-(longD*2)
            };
            bottomRight={
                lat:lat-(latD*2),
                long:long+(longD*2)
            };
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
            //filter out locations outside of viewport
            var locInView=[{
                    location:'',
                    lat:0,
                    long:0,
                    rank:1,
                    distanceAway:0,
                    category:0
                }];
            var source;
            for(var i=0;i<val.results.length;i++){
                //bottomRight.lat <loc.lat<topLeftCor.lat && topLeft.long <loc.long<bottomRight.long
                var currLoc={
                   lat:val.results[i].lat,
                    long:val.results[i].long
                };
                //if current location is within viewport
                if( bottomRight.lat <currLoc.lat && currLoc.lat<topLeftCor.lat && topLeftCor.long <currLoc.long && currLoc.long<bottomRight.long){
                    //create ranking for current location based on category + popularity
                    rank=val.results[i].priority;
                    //console.log("rank: " + rank);
                        //catRank[val.results[i].category_id]*val.results[i].priority;
                    //if current rank is greater than the lowest rank in locInView
                    if(rank>locInView[locInView.length-1].rank){
                        //console.log("current location is ranked high enough!")
                        //add the current location to the list
                        if(val.results[i].category_id){
                            source="../../assets/images/loc_icons/" + val.results[i].category_id-1000 +".png"
                        }
                        else{
                            source="../../assets/images/loc_icons/1.png"
                        }
                        locInView.push({
                            location:val.results[i].name,
                            lat:val.results[i].lat,
                            long:val.results[i].long,
                            rank:rank,
                            distanceAway: FeetConverter(haversine(
                                [lat,long],
                                [val.results[i].lat,val.results[i].long])),
                            category:val.results[i].category_id,
                            imgSrc:source
                        });
                        //re-sort the list which includes the current location
                        locInView=locInView.sort(function(a,b){return a.rank-b.rank;});
                    }
                }
            }
            // var blah=locInView.slice(0,10);
            // for(var j=0;j<blah.length;j++){
            //     console.log("Rank: "+blah[j].rank);
            // }
            // //return list of 10 locations
            console.log("royce: " + locInView[0].location);
            console.log("Image Source :" + locInView[2].imgSrc);
            return locInView.slice(0,10);
        }
    } catch (error) {
        // Error retrieving data
        console.log(error.message)
    }
}

export function DistancePrioritize(currentLat,currentLong, data){
    try {
        const value = data
        if (value !== null){
            // We have data!!
            let val = JSON.parse(value);

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

            var source;

            var DistAway = [];
            for(var i = 0; i<val.results.length; i++){
                if(val.results[i].category_id){
                    source="../../assets/images/loc_icons/" + val.results[i].category_id-1000 +".png"
                }
                else{
                    source="../../assets/images/loc_icons/1.png"
                }
                DistAway.push({
                    location:val.results[i].name,
                    distanceAway: FeetConverter(haversine(
                        [currentLat,currentLong],
                        [val.results[i].lat,val.results[i].long])),
                    lat:val.results[i].lat,
                    long:val.results[i].long,
                    category:val.results[i].category_id,
                    imgSrc:source
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
            var stuff = DistAway.slice(0,10);
            return stuff;
        }
    } catch (error) {
        // Error retrieving data
        console.log(error.message)
    }
}

//given a location name (string), returns data object
export function LocToData(location,data){
    try{
        const value = data;
        if(value!==null){
            const results = value.results;
            return data.results.find(function(loc){return loc.name === location});
        }
    } catch (error) {
        console.log(error.message)
    }
}

//given location category, return image source for icon
export function LocToIcon(location_cat){
    var loc_file=location_cat-1000;
    var imgSrc= "../../assets/images/loc_icons/" + loc_file +".png";
    return imgSrc;
}