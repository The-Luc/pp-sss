import { COPY_OBJECT_KEY } from '../constants/config';

/**
 * Check input data is json string or not
 * @returns {Boolean} Data is json string or not
 */
export const isJsonString = str => {
  try {
    JSON.parse(str);
  } catch {
    return false;
  }
  return true;
};

/**
 * Check data copied has object(s) or not by compare with key special
 * @returns {Boolean} Data copied is fabric object or not
 */
export const isFabricObject = data => {
  const jsonData = JSON.parse(data);
  const key = Object.keys(jsonData);
  return key.includes(COPY_OBJECT_KEY);
};
