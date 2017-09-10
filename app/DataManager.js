'use strict';

// TODO: import real AsyncStorage for running on device
//import { AsyncStorage } from 'react-native';
import { AsyncStorage } from 'app/__fakes__/FakeAsyncStorage';

import {
  Location,
  Category,
  Tour,
  IndoorBuilding
} from 'app/DataTypes';

/**
 * Constants
 */

const CACHE_PREFIX = '@tours:';
const TIMESTAMP_PREFIX = CACHE_PREFIX + 'timestamp:';
const CACHE_EXPIRY = 20 * 60 * 60 * 1000; // 20 hours

const API_DOMAIN = 'https://tours.bruinmobile.com';

// API endpoints
const ENDPOINTS = {
  LOCATIONS: '/api/landmark/',
  CATEGORIES: '/api/category/',
  TOURS: '/api/tour/',
  INDOOR_BUILDINGS: '/indoor/building/',
};

// has LoadAllData been called?
let DATA_LOADED = false;

/**
 * Helper functions
 */

function find(data, key, value) {
  /**
   * @param data Array{Object}
   * @return the first matching Object, or null if no matches
   */

  let matches = data.filter(obj => obj[key] === value);

  if (matches.length == 0) {
    return null;
  }
  return matches[0];
}

/**
 * SyncStorage: store data in memory. This is reset when the app is closed.
 */
class SyncStorage {
  constructor() {
    this.storage = {};
  }

  getItem(key) {
    return this.storage[key] || null;
  }

  setItem(key, value) {
    this.storage[key] = value;
  }

  removeItem(key) {
    delete this.storage[key];
  }

  getAllKeys() {
    return Object.keys(this.storage);
  }
};
const syncStorage = new SyncStorage();


/**
 * AsyncStorage management functions
 */

async function getCacheTime(endpoint) {
  /**
   * Get the time this API call was cached
   */

  let key = TIMESTAMP_PREFIX + endpoint;
  try {
    const data = await AsyncStorage.getItem(key);
    if (data !== null) {
      return parseInt(data);
    }
  } catch(error) {
    console.error(error);
  }

  // not found, force cache update
  return 0;
}

async function updateCacheTime(endpoint) {
  /**
   * Update the endpoint's cache timestamp
   */

  let key = TIMESTAMP_PREFIX + endpoint;
  let timestamp = Date.now();
  try {
    await AsyncStorage.setItem(key, timestamp.toString());
  } catch(error) {
    console.error(error);
  }
}

async function getCachedData(endpoint) {
  /**
   * Get cached API response from AsyncStorage
   */

  let key = CACHE_PREFIX + endpoint;
  try {
    const data = await AsyncStorage.getItem(key);
    if (data !== null) {
      return JSON.parse(data);
    }
  } catch(error) {
    console.error(error);
  }
  return null;
}

async function setCachedData(endpoint, data) {
  /**
   * Cache API response in AsyncStorage
   */

  let key = CACHE_PREFIX + endpoint;
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch(error) {
    console.error(error);
  }
}

async function queryEndpoint(endpoint, transformData) {
  /**
   * Fetch data from the server
   * @param endpoint string
   * @return Promise
   */

  //console.info(`queryEndpoint('${endpoint}')`);

  // default: no transform
  transformData = transformData || (data => data);

  let url = API_DOMAIN + endpoint;
  return fetch(url)
    .then(response => response.json())
    .then(data => data['results'])
    .then(data => transformData(data));
}

async function getData(endpoint, transformData, useAsyncStorage = false) {
  /**
   * get cached data, and fetch data if needed
   * @param endpoint string
   * @return Promise
   */

  // check if data is in SyncStorage
  let cachedDataSync = syncStorage.getItem(endpoint);
  if (cachedDataSync !== null) {
    return cachedDataSync;
  }

  // check if data is in AsyncStorage
  if (useAsyncStorage) {
    let currentTime = Date.now();
    let cacheTime = await getCacheTime(endpoint);

    // this request was updated recently, try to use the cached value
    if (currentTime - cacheTime < CACHE_EXPIRY) {
      let cachedData = await getCachedData(endpoint);

      if (cachedData !== null) {
        return cachedData;
      }
    }
  }

  // there is no up-to-date cached data, need to query server
  let newData;
  try {
    newData = await queryEndpoint(endpoint, transformData);
  } catch(error) {
    console.error(error);
    return null;
  }

  if (newData !== null) {
    // save the data in the cache
    syncStorage.setItem(endpoint, newData);

    if (useAsyncStorage) {
      await setCachedData(endpoint, newData);
      await updateCacheTime(endpoint);
    }
  }

  return newData;
}

function getDataSync(endpoint) {
  /**
   * Fetch data synchronously. Must be called after LoadAllData has resolved.
   */

  if (!DATA_LOADED) {
    console.error('The data has not been loaded yet.');
    return;
  }

  return syncStorage.getItem(endpoint);
}

async function clearCache() {
  /**
   * Remove everything from the cache
   */
  let keys = syncStorage.getAllKeys();
  keys.forEach(key => {
    if (key.startsWith(CACHE_PREFIX)) {
      syncStorage.removeItem(key);
    }
  });

  keys = await AsyncStorage.getAllKeys();
  keys.forEach(key => {
    if (key.startsWith(CACHE_PREFIX)) {
      AsyncStorage.removeItem(key);
    }
  });
}


/**
 * Exports
 */

export async function LoadAllData() {
  /**
   * Sends API requests to get all of the data needed from the server. This
   * only needs to be called one time when the app is initially loaded.
   */

  if (DATA_LOADED) {
    console.warn('LoadAllData has already been called.');
    return;
  }

  await Promise.all([

    // Locations
    getData(ENDPOINTS.LOCATIONS, (data) => {
      return data.map(loc => {
        // give images a full URL
        loc.images = loc.images.map(image => {
          for (let size in image) {
            image[size] = API_DOMAIN + image[size];
          }
          return image;
        });

        return new Location(loc);
      });
    }),

    // Categories
    getData(ENDPOINTS.CATEGORIES, (data) => {
      return data.map(category => {
        return new Category(category);
      });
    }),

    // Tours
    getData(ENDPOINTS.TOURS, (data) => {
      return data.map(tour => {
        return new Tour(tour);
      });
    }),

    // IndoorBuildings
    getData(ENDPOINTS.INDOOR_BUILDINGS, (data) => {
      return data.map(building => {
        return new IndoorBuilding(building);
      });
    }),

  ]);

  DATA_LOADED = true;
}

export function GetLocationList() {
  /**
   * @return Location[]
   */
  return getDataSync(ENDPOINTS.LOCATIONS);
}

export function GetLocationById(id) {
  /**
   * @param id int
   * @return Location
   */
  return find(GetLocationList(), 'id', id);
}

export function GetLocationByName(name) {
  /**
   * @param name string
   * @return Location
   */
  return find(GetLocationList(), 'name', name);
}

export function GetCategoryList() {
  /**
   * @return Category[]
   */
  return getDataSync(ENDPOINTS.CATEGORIES);
}

export function GetCategoryById(id) {
  /**
   * @param id int
   * @return Category
   */
  return find(GetCategoryList(), 'id', id);
}

export function GetCategoryByName(name) {
  /**
   * @param name string
   * @return Category
   */
  return find(GetCategoryList(), 'name', name);
}

export function GetTourList() {
  /**
   * @return Tour[]
   */
  return getDataSync(ENDPOINTS.TOURS);
}

export function GetTourById(id) {
  /**
   * @param id int
   * @return Tour
   */
   return find(GetTourList(), 'id', id);
}

export function GetIndoorBuildingList() {
  /**
   * @return IndoorBuilding[]
   */
  return getDataSync(ENDPOINTS.INDOOR_BUILDINGS);
}

export function GetIndoorBuildingById(id) {
  /**
   * @param id int landmark id
   * @return IndoorBuilding
   */
  return find(GetIndoorBuildingList(), 'landmark_id', id);
}
