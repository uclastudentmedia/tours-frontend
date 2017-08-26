import 'isomorphic-fetch';

const API_DOMAIN = 'https://tours.bruinmobile.com';

// API endpoints
const ENDPOINTS = {
  LANDMARKS: '/api/landmark/',
  CATEGORIES: '/api/category/',
  TOURS: '/api/tour/'
};


/**
 * Helper functions
 */

async function queryEndpoint(endpoint) {
  /**
   * Fetch data from the server
   * @param endpoint string
   * @return Promise
   */

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

  // TODO: check if cached
  return queryEndpoint(endpoint);
}

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
 * Exports
 */

export async function GetLandmarkList() {
  /**
   * @return Array of Landmark objects
   */
  return getData(ENDPOINTS.LANDMARKS);
}

export async function GetLandmark(id) {
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

export async function GetCategory(id) {
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

export async function GetTour(id) {
  /**
   * @param id int
   * @return Tour object
   */
  return getData(ENDPOINTS.TOURS)
    .then(tours => find(tours, 'id', id));
}
