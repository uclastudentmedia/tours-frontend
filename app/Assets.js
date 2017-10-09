'use strict';

//export const icon_ph = require('../assets/images/icon_ph.png');
export const dot1 = require('../assets/images/dot1.png');
export const logo = require('../assets/images/logo_1x.png');
export const logoArtboard = require('../assets/images/logoArtboard.png');
export const paw_blue = require('../assets/images/paw_blue.png');
export const paw_white = require('../assets/images/paw_white.png');

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
  return icons[category_id] || defaultIcon;
}

//export const ic_near_me = require('../assets/images/ic_near_me_black_24dp.png');
//export const ic_school = require('../assets/images/ic_school_black_24dp.png');
//export const ic_directions_walk = require('../assets/images/ic_directions_walk_black_24dp.png');


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
