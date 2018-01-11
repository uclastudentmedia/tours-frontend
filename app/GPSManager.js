'use strict';

import { Alert } from 'react-native';

export default class GPSManager {
  static options = {
    enableHighAccuracy: true,
    timeout: 30000,
    maximumAge: 30000,
  };

  constructor() {
    //navigator.geolocation.requestAuthorization();
  }

  warn(error) {
    console.warn(error.message || error);
  }

  alert() {
    Alert.alert('Unable to find your location.');
  }

  watchPosition(success, error = this.warn, options = this.options) {
    navigator.geolocation.getCurrentPosition(p => success(p.coords), error, options);
    return navigator.geolocation.watchPosition(p => success(p.coords), error, options);
  }

  getPosition(success, error = this.alert, options = this.options) {
    return navigator.geolocation.getCurrentPosition(p => success(p.coords), error, options);
  }

  clearWatch(watchID) {
    return navigator.geolocation.clearWatch(watchID);
  }
}
