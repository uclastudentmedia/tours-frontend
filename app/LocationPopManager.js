/**
 * Created by danielhuang on 9/7/17.
 */
/**
 * Variable
 */
var locInView=[];
var db=[];
var lat = 0;
var long = 0;
var latD = 0;
var longD = 0;
var category = 'All';
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
/**
* Helper Functions
**/

//Filter locations from db to just locations in view
//Use only for MainMapView
function filterLocsToView(){
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

}

function addLoc(name,latitude, longitude, priority, distAway, category, id){
    locInView.push({
        location: name,
        lat: latitude,
        long: longitude,
        rank: priority,
        distanceAway: distAway,
        category: category,
        id: id
    });
}
function popLocations(){
    console.log('Populating Locations!');
    //sort everything in val
    var tempRes=db.sort(function(a,b){return a.priority-b.priority;});

    //check if category filter exists, if it doesn't, set category to all
    if(!(category in catDict)){ category = 'All'}
    //check if category is parking, if so reverse priority (most obscure parking lots to most popular parking lots)
    if(category==="Parking"){tempRes=tempRes.sort(function(a,b){return b.priority-a.priority});}
    console.log(tempRes);
    //fill out locations based on category (locInView)
    for(i=0; i<tempRes.length;i++){
        //Select for parking category and display parking locations
        if(tempRes[i].category_id === catDict[category]){
            addLoc(tempRes[i].name,tempRes[i].lat,tempRes[i].long,tempRes[i].priority,
                feetCalc(lat,long,tempRes[i].lat,tempRes[i].long),tempRes[i].category_id,tempRes[i].id);
        }
    }
    console.log(locInView);
    return locInView;
}

/**
 * Exports
 */

export function initializeParameters(database, latitude, longitude, latitudeD, longitudeD){
    console.log('Initializing Location Parameters');
    db = database;
    lat = latitude;
    long = longitude;
    latD = latitudeD;
    longD = longitudeD;
}

export function setCategory(cat){
    category = cat;
}

export function popMapView(){
    filterLocsToView();
    popLocations();
}

export function popLocationListView(){
    popLocations();
}