/**
 * Created by Daniel on 2/10/2017.
 */

import React, { Component } from 'react';
import {Image,Navigator} from 'react-native';
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

export function popPrioritize(data,lat,long,latD,longD){
    try{
        const value=data;
        if(value!==null){
            //console.log("pop prioritize");
            // We have data!!
            let val = JSON.parse(value);
            //create rectangular area
            //est topLeft and bottomRight long/lat based on long,lat, long delta, and lat delta
            topLeftCor={
                lat:lat-(latD/2),
                long:long+(longD/2)
            };
            bottomRight={
                lat:lat+(latD/2),
                long:long-(longD/2)
            };

            //filter out locations outside of viewport
            var locInView=[];
            //sort everything in val.results
            var tempRes=val.results.sort(function(a,b){return a.priority-b.priority;});

            //loop through all locations to filter by: zoom level

            tempRes=tempRes.filter(function(loc){
                if(loc.long>topLeftCor.long||loc.long<bottomRight.long
                    || loc.lat>bottomRight.lat||loc.lat<topLeftCor.lat){
                    return false;
                }
                else{
                    return true;
                }
            });
            //save top 10 results to locInView
            for(var i=0;i<20;i++){
                locInView.push({
                    location:tempRes[i].name,
                    lat:tempRes[i].lat,
                    long:tempRes[i].long,
                    rank:tempRes[i].priority,
                    distanceAway:feetCalc(lat,long,tempRes[i].lat,tempRes[i].long),
                    category:tempRes[i].category_id
                });
            }
            return locInView;
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
                    source="../../assets/loc_icons/" + val.results[i].category_id-1000 +".png"
                }
                else{
                    source="../../assets/loc_icons/1.png"
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

export function renderImage(category,view){
    styleClass='';
    if(view==='details'){
        styleClass=dstyles.icon;
    }
    else{
        styleClass=styles.placeholder;
    }
    switch(category)
    {
        case 1:
            return(
                <Image style={styleClass} source={require('../assets/new_sizes/1.png')}/>
            );
            break;
        case 2:
            return(
                <Image style={styleClass} source={require('../assets/new_sizes/2.png')}/>
            );
            break;
        case 3:
            return(
                <Image style={styleClass} source={require('../assets/new_sizes/3.png')}/>
            );
            break;
        case 4:
            return(
                <Image style={styleClass} source={require('../assets/new_sizes/4.png')}/>
            );
            break;
        /*case 5:
            return(
                <Image style={styleClass} source={require('../assets/new_sizes/5.png')}/>
            );*/
        case 6:
            return(
                <Image style={styleClass} source={require('../assets/new_sizes/6.png')}/>
            );
            break;
        case 7:
            return(
                <Image style={styleClass} source={require('../assets/new_sizes/7.png')}/>
            );
            break;
        case 8:
            return(
                <Image style={styleClass} source={require('../assets/new_sizes/8.png')}/>
            );
            break;
        case 9:
            return(
                <Image style={styleClass} source={require('../assets/new_sizes/9.png')}/>
            );
            break;
        case 10:
            return(
                <Image style={styleClass} source={require('../assets/new_sizes/10.png')}/>
            );
            break;
        case 11:
            return(
                <Image style={styleClass} source={require('../assets/new_sizes/11.png')}/>
            );
            break;
        case 12:
            return(
                <Image style={styleClass} source={require('../assets/new_sizes/12.png')}/>
            );
            break;
        case 13:
            return(
                <Image style={styleClass} source={require('../assets/new_sizes/13.png')}/>
            );
            break;
        case 14:
            return(
                <Image style={styleClass} source={require('../assets/new_sizes/14.png')}/>
            );
            break;
        case 15:
            return(
                <Image style={styleClass} source={require('../assets/new_sizes/15.png')}/>
            );
            break;
        // case 16:
        //     return(
        //         <Image style={styles.placeholder} source={require('../../assets/loc_icons/16.png')}/>
        //     );
        //case 17:
          //  return(
            //    <Image style={styleClass} source={require('../assets/new_sizes /17.png')}/>
            //);
        case 18:
            return(
                <Image style={styleClass} source={require('../assets/new_sizes/18.png')}/>
            );
            break;
        case 20:
            return(
                <Image style={styleClass} source={require('../assets/new_sizes/20.png')}/>
            );
            break;
        case 61:
            return(
                <Image style={styleClass} source={require('../assets/new_sizes/61.png')}/>
            );
            break;
        case 321:
            return(
                <Image style={styleClass} source={require('../assets/new_sizes/321.png')}/>
            );
            break;
        case 961:
            return(
                <Image style={styleClass} source={require('../assets/new_sizes/961.png')}/>
            );
            break;
        case 1285:
            return(
                <Image style={styleClass} source={require('../assets/new_sizes/1285.png')}/>
            );
            break;
    }
}
