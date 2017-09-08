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

export function popPrioritize(val,lat,long,latD,longD, category){
    if(!val) {
        return [];
    }
    var catDict=
        {
            'All':'',
            'Parking':1,
            'Shop':2,
            'Theater':3,
            'Bank':4,
            'Hospital':6,
            'Gym':7,
            'Info':8,
            'Library':9,
            'Police':10,
            'POI':11,
            'Apartment':12,
            'Lecture Hall':13,
            'Food':14,
            'Garden':18,
            'Computer Lab':20,
        };
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
    //check if category filter exists, if it doesn't, set category to all
    if(!(category in catDict)){ category = 'All'}
    //check if category is parking, if so reverse priority (most obscure parking lots to most popular parking lots)
    if(category==="Parking"){tempRes=tempRes.sort(function(a,b){return b.priority-a.priority});}
    if(category==='All'){
        for(i=0; i<20;i++){
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
        for(i=0; i<tempRes.length;i++){
            //Select for food category and displays food locations within 800 feet
            if(tempRes[i].category_id === catDict[category] ){
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

    /*switch(category)
    {
        case 'All':
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
            break;
        case 'Food':
            console.log("user selected food!");
            for(i=0; i<tempRes.length;i++){
                //Select for food category and displays food locations within 800 feet
                if(tempRes[i].category_id === 14 ){
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
    }*/


    return locInView;
}

export function DistancePrioritize(currentLat,currentLong, val){
    if (!val) {
        return [];
    }
    // We have data!!

    var source;

    var DistAway = [];
    for(var i = 0; i<val.length; i++){
        if (val[i].category_id) {
            source = LocToIcon(val[i].category_id);
        }
        else {
            source = LocToIcon(1);
        }
        DistAway.push({
            location:val[i].name,
            distanceAway:feetCalc(currentLat, currentLong,
                                  val[i].lat, val[i].long),
            lat:val[i].lat,
            long:val[i].long,
            category:val[i].category_id,
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
    return DistAway.slice(0,10);
}

//given a location name (string), returns data object
export function LocToData(location,data){
      if(data) {
          return data.find(function(loc){return loc.name === location});
      }
      return null;
}

//given location category, return image source for icon
export function LocToIcon(location_cat){
    var loc_file=location_cat;
    var imgSrc= "../../assets/new_sizes/" + loc_file + ".png";
    return imgSrc;
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
