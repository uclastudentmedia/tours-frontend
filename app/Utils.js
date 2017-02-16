/**
 * Created by Daniel on 2/10/2017.
 */

import React, { Component } from 'react';
import {
    AsyncStorage
} from 'react-native';

export async function DistancePrioritize(currentLat,currentLong){
    try {
        const value = await AsyncStorage.getItem('data');
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

            var DistAway = [];
            for(var i = 0; i<val.results.length; i++){
                DistAway.push({
                    location:val.results[i].name,
                    distanceAway: FeetConverter(haversine(
                        [currentLat,currentLong],
                        [val.results[i].lat,val.results[i].long]
                    ))
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

//import React, { Component } from 'react';
//import {
//    AsyncStorage
//} from 'react-native';
//
//export async function DistancePrioritize(currentLat,currentLong){
//    try {
//        const value = await AsyncStorage.getItem('data');
//        if (value !== null){
//
//            /*
//            // We have data!!
//            let val = JSON.parse(value);
//
//            // haversine :: (Num, Num) -> (Num, Num) -> Num
//            let haversine = ([lat1, lon1], [lat2, lon2]) => {
//                // Math lib function names
//                let [pi, asin, sin, cos, sqrt, pow, round] =
//                        ['PI', 'asin', 'sin', 'cos', 'sqrt', 'pow', 'round']
//                            .map(k => Math[k]),
//
//                // degrees as radians
//                    [rlat1, rlat2, rlon1, rlon2] = [lat1, lat2, lon1, lon2]
//                        .map(x => x / 180 * pi),
//
//                    dLat = rlat2 - rlat1,
//                    dLon = rlon2 - rlon1,
//                    radius = 6372.8; // km
//
//                // km
//                return round(
//                        radius * 2 * asin(
//                            sqrt(
//                                pow(sin(dLat / 2), 2) +
//                                pow(sin(dLon / 2), 2) *
//                                cos(rlat1) * cos(rlat2)
//                            )
//                        ) * 100
//                    ) / 100;
//            };
//
//            // Return in feet (converts km to ft)
//            function FeetConverter(km){return km * 3280.84;}
//
//            var DistAway = [];
//            for(var i = 0; i<val.results.length; i++){
//                DistAway.push({
//                    location:val.results[i].name,
//                    distanceAway: FeetConverter(haversine(currentLat,currentLong,val.results[i].lat,val.results[i].long))
//                });
//            }
//            /*DistAway.sort(function(a,b){
//                if(a.distanceAway<b.distanceAway){
//                    return -1;
//                }
//                if(a.distanceAway>b.distanceAway){
//                    return 1;
//                }
//                return 0;
//            });*/
//            console.log("hello");
//            return 3;
//
//            //return DistAway.slice(0,10);
//        }
//    } catch (error) {
//        // Error retrieving data
//        console.log(error.message)
//    }
//}
//
////calculates distance between two lat long points and returns the distance apart in feet
///*export function DistanceCalc([lat1, lon1], [lat2, lon2]){
//    // haversine :: (Num, Num) -> (Num, Num) -> Num
//    let haversine = ([lat1, lon1], [lat2, lon2]) => {
//        // Math lib function names
//        let [pi, asin, sin, cos, sqrt, pow, round] =
//                ['PI', 'asin', 'sin', 'cos', 'sqrt', 'pow', 'round']
//                    .map(k => Math[k]),
//
//        // degrees as radians
//            [rlat1, rlat2, rlon1, rlon2] = [lat1, lat2, lon1, lon2]
//                .map(x => x / 180 * pi),
//
//            dLat = rlat2 - rlat1,
//            dLon = rlon2 - rlon1,
//            radius = 6372.8; // km
//
//        // km
//        return round(
//                radius * 2 * asin(
//                    sqrt(
//                        pow(sin(dLat / 2), 2) +
//                        pow(sin(dLon / 2), 2) *
//                        cos(rlat1) * cos(rlat2)
//                    )
//                ) * 100
//            ) / 100;
//    };
//
//    // Return in feet (converts km to ft)
//    function FeetConverter(km){return km * 3280.84;}
//    return FeetConverter(haversine(
//        [lat1,lon1],
//        [lat2,lon2]
//    ));
//}*/