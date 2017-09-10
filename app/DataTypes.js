'use strict';

class ImmutableObject {
  constructor(json) {
    if (typeof(json) !== 'object' || json === null) {
      throw new TypeError('Expected an object, got ', json);
    }

    Object.assign(this, json);
    Object.freeze(this);
  }
}

export class Location extends ImmutableObject {}
