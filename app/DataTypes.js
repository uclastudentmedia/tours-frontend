'use strict';

import { feetCalc } from 'app/Utils';

class ImmutableObject {
  constructor(json) {
    if (typeof(json) !== 'object' || json === null) {
      throw new TypeError('Expected an object, got ', json);
    }

    Object.assign(this, json);
    Object.freeze(this);
  }
}

export class Location extends ImmutableObject {
  FeetAway(from) {
    if (from.latitude && from.longitude) {
      const dist = feetCalc(from.latitude, from.longitude, this.lat, this.long);
      return Math.round(dist);
    }
    return -1; // error
  }
}

export class Category extends ImmutableObject {}
export class Tour extends ImmutableObject {}
export class IndoorBuilding extends ImmutableObject {}
