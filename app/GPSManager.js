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

  watchPosition(geo_success,
                geo_error = () => {},
                options = this.options) {

    navigator.geolocation.getCurrentPosition(geo_success, geo_error, options);
    return navigator.geolocation.watchPosition(geo_success, geo_error, options);
  }

  clearWatch() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  getPosition() {
    return this.position;
  }
}
