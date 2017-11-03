'use strict';

import { CURRENT_LOCATION_ID } from 'app/Utils';

//export const icon_ph = require('../assets/images/icon_ph.png');
export const dot1 = require('../assets/images/dot1.png');
export const logo = require('../assets/images/logo_1x.png');
export const logoArtboard = require('../assets/images/logoArtboard.png');
export const paw_blue = require('../assets/images/paw_blue.png');
export const paw_white = require('../assets/images/paw_white.png');
//export const ic_near_me = require('../assets/images/ic_near_me_black_24dp.png');
//export const ic_school = require('../assets/images/ic_school_black_24dp.png');
//export const ic_directions_walk = require('../assets/images/ic_directions_walk_black_24dp.png');


const icons = {
  1: require('../assets/icons/1.png'),
  2: require('../assets/icons/2.png'),
  3: require('../assets/icons/3.png'),
  4: require('../assets/icons/4.png'),
  5: require('../assets/icons/5.png'),
  6: require('../assets/icons/6.png'),
  8: require('../assets/icons/8.png'),
  9: require('../assets/icons/9.png'),
  10: require('../assets/icons/10.png'),
  11: require('../assets/icons/11.png'),
  12: require('../assets/icons/12.png'),
  13: require('../assets/icons/13.png'),
  14: require('../assets/icons/14.png'),
  15: require('../assets/icons/15.png'),
  16: require('../assets/icons/16.png'),
  17: require('../assets/icons/17.png'),
  18: require('../assets/icons/18.png'),
  20: require('../assets/icons/20.png'),
  321: require('../assets/icons/321.png'),
  961: require('../assets/icons/961.png'),
  1285: require('../assets/icons/1285.png'),
  general: require('../assets/icons/general.png'),
};
export function GetIcon(category_id) {
  var defaultIcon = icons.general;

  // no icon for "current location" landmark
  if (category_id == CURRENT_LOCATION_ID) {
    return null;
  }

  return icons[category_id] || defaultIcon;
}

const tabIcons = {
  maps: {
    true:  require('../assets/tab_icons/maps_blue.png'),
    false: require('../assets/tab_icons/maps_gray.png'),
  },
  explore: {
    true:  require('../assets/tab_icons/explore_blue.png'),
    false: require('../assets/tab_icons/explore_gray.png'),
  },
  indoors: {
    true:  require('../assets/tab_icons/indoors_blue.png'),
    false: require('../assets/tab_icons/indoors_gray.png'),
  },
  tours: {
    true:  require('../assets/tab_icons/tours_blue.png'),
    false: require('../assets/tab_icons/tours_gray.png'),
  },
};
export function GetTabIcon(name, focused) {
  return tabIcons[name][focused];
}

// Maneuver Types
// https://mapzen.com/documentation/mobility/turn-by-turn/api-reference/#trip-legs-and-maneuvers
const kNone = 0;
const kStart = 1;
const kStartRight = 2;
const kStartLeft = 3;
const kDestination = 4;
const kDestinationRight = 5;
const kDestinationLeft = 6;
const kBecomes = 7;
const kContinue = 8;
const kSlightRight = 9;
const kRight = 10;
const kSharpRight = 11;
const kUturnRight = 12;
const kUturnLeft = 13;
const kSharpLeft = 14;
const kLeft = 15;
const kSlightLeft = 16;
const kRampStraight = 17;
const kRampRight = 18;
const kRampLeft = 19;
const kExitRight = 20;
const kExitLeft = 21;
const kStayStraight = 22;
const kStayRight = 23;
const kStayLeft = 24;
const kMerge = 25;
const kRoundaboutEnter = 26;
const kRoundaboutExit = 27;
const kFerryEnter = 28;
const kFerryExit = 29;
const kTransit = 30;
const kTransitTransfer = 31;
const kTransitRemainOn = 32;
const kTransitConnectionStart = 33;
const kTransitConnectionTransfer = 34;
const kTransitConnectionDestination = 35;
const kPostTransitConnectionDestination = 36;

const TBTIcons = {
  left: require('../assets/tbt_icons/left.png'),
  right: require('../assets/tbt_icons/right.png'),
  near_me: require('../assets/images/ic_near_me_black_24dp.png'),
  walk: require('../assets/images/ic_directions_walk_black_24dp.png'),
};
export function GetTBTIcon(type) {
  switch(type) {

    case kStart:
    case kStartRight:
    case kStartLeft:
    case kDestination:
    case kDestinationRight:
    case kDestinationLeft:
      return TBTIcons.near_me;

    case kUturnLeft:
    case kSharpLeft:
    case kLeft:
    case kSlightLeft:
    case kRampLeft:
    case kExitLeft:
    case kStayLeft:
      return TBTIcons.left;

    case kUturnRight:
    case kSharpRight:
    case kRight:
    case kSlightRight:
    case kRampRight:
    case kExitRight:
    case kStayRight:
      return TBTIcons.right;

    default:
      return TBTIcons.walk;
  }
}
