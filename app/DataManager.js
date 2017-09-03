'use strict';

import 'isomorphic-fetch';

// TODO: import real AsyncStorage for running on device
//import { AsyncStorage } from 'react-native';
import { AsyncStorage } from '../__fakes__/FakeAsyncStorage';

/**
 * Constants
 */

const CACHE_PREFIX = '@tours:';
const TIMESTAMP_PREFIX = CACHE_PREFIX + 'timestamp:';
const CACHE_EXPIRY = 20 * 60 * 60 * 1000; // 20 hours

const API_DOMAIN = 'https://tours.bruinmobile.com';

// API endpoints
const ENDPOINTS = {
  LANDMARKS: '/api/landmark/',
  CATEGORIES: '/api/category/',
  TOURS: '/api/tour/',
  INDOOR_BUILDINGS: '/indoor/building/',
};


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
 * Storage management functions
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

async function queryEndpoint(endpoint) {
  /**
   * Fetch data from the server
   * @param endpoint string
   * @return Promise
   */

  //console.info(`queryEndpoint('${endpoint}')`);

  let url = API_DOMAIN + endpoint;
  return fetch(url)
    .then(response => response.json())
    .then(data => data['results']);
}

async function getData(endpoint) {
  /**
   * get cached data, and fetch data if needed
   * @param endpoint string
   * @return Promise
   */

  let currentTime = Date.now();
  let cacheTime = await getCacheTime(endpoint);

  if (currentTime - cacheTime < CACHE_EXPIRY) {
    // this request was updated recently, try to use the cached value
    let cachedData = await getCachedData(endpoint);
    if (cachedData !== null) {
      return cachedData;
    }
  }

  // there is no up-to-date cached data, need to query server
  let newData = await queryEndpoint(endpoint);

  // save the data in the cache
  await setCachedData(endpoint, newData);
  await updateCacheTime(endpoint);

  return newData;
}

async function clearCache() {
  /**
   * Remove everything from the cache
   */
  let keys = await AsyncStorage.getAllKeys();
  keys.forEach(key => {
    if (key.startsWith(CACHE_PREFIX)) {
      AsyncStorage.removeItem(key);
    }
  });
}


/**
 * Exports
 */

export async function GetLandmarkList() {
  /**
   * @return Array of Landmark objects
   */
  return getData(ENDPOINTS.LANDMARKS);
}

export async function GetLandmarkById(id) {
  /**
   * @param id int
   * @return Landmark object
   */
  return getData(ENDPOINTS.LANDMARKS)
    .then(landmarks => find(landmarks, 'id', id));
}

export async function GetCategoryList() {
  /**
   * @return Array of Category objects
   */
  return getData(ENDPOINTS.CATEGORIES);
}

export async function GetCategoryById(id) {
  /**
   * @param id int
   * @return Category object
   */
  return getData(ENDPOINTS.CATEGORIES)
    .then(categories => find(categories, 'id', id));
}

export async function GetTourList() {
  /**
   * @return Array of Tour objects
   */
  return getData(ENDPOINTS.TOURS);
}

export async function GetTourById(id) {
  /**
   * @param id int
   * @return Tour object
   */
  return getData(ENDPOINTS.TOURS)
    .then(tours => find(tours, 'id', id));
}

export async function GetIndoorBuildingList() {
  /**
   * @return Array of Building object
   */
  return getData(ENDPOINTS.INDOOR_BUILDINGS);
}

export async function GetIndoorBuildingById(id) {
  /**
   * @param id int landmark id
   * @return Building object
   */
  return getData(ENDPOINTS.INDOOR_BUILDINGS)
    .then(buildings => find(buildings, 'landmark_id', id));
}
