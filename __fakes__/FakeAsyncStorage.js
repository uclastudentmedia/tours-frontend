'use strict';

const storage = {};

function notImplemented() {
    return new Promise((resolve, reject) => {
      reject('not implemented');
    });
};

const TRACE = true;
function trace(func, key, value) {
  if (TRACE) {
    if (value) {
      console.info(`AsyncStorage.${func}('${key}', '${value.substr(0, 20)}')`);
    }
    else if (key) {
      console.info(`AsyncStorage.${func}('${key}')`);
    }
    else {
      console.info(`AsyncStorage.${func}()`);
    }
  }
};

export const AsyncStorage = {

  getItem: (key) => {
    trace('getItem', key);
    return new Promise((resolve, reject) => {
      resolve(storage[key]);
    });
  },

  setItem: (key, value) => {
    trace('setItem', key, value);
    return new Promise((resolve, reject) => {        
      storage[key] = value;
      resolve(value);
    });
  },

  removeItem: (key) => {
    trace('removeItem', key);
    return new Promise((resolve, reject) => {
      resolve(delete storage[key]);
    });
  },

  getAllKeys: () => {
    trace('getAllKeys');
    return new Promise((resolve) => {
      resolve(Object.keys(storage));
    });
  },

  // function stubs
  mergeItem: notImplemented,
  clear: notImplemented,
  flushGetRequests: notImplemented,
  multiGet: notImplemented,
  multiSet: notImplemented,
  multiRemove: notImplemented,
  multiMerge: notImplemented
};
