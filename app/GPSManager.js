'use strict';

export default class GPSManager {
  static options = {
    enableHighAccuracy: true,
    timeout: 30000,
    maximumAge: 30000,
  };

  constructor() {
    //navigator.geolocation.requestAuthorization();

    // internal watch
    this.watchID = this.watchPosition(this.updatePosition);
  }

  updatePosition = (position) => {
    this.position = position.coords;
  }

  warn(error) {
    console.warn(error.message || error);
  }

  watchPosition(geo_success,
                geo_error = this.warn,
                options = this.options) {

    navigator.geolocation.getCurrentPosition(geo_success, geo_error, options);
    return navigator.geolocation.watchPosition(geo_success, geo_error, options);
  }

  clearInternalWatch() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  clearWatch(watchID) {
    navigator.geolocation.clearWatch(watchID);
  }

  getPosition() {
    return this.position;
  }
}
