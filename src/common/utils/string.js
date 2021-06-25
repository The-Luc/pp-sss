import { COPY_OBJECT_KEY } from '../constants/config';

/**
 * Check input data is json string or not
 * @returns {Boolean} Data is json string or not
 */
export const getJson = str => {
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
};

/**
 * Check data copied has object(s) or not by compare with key special
 * @returns {Boolean} Data copied is fabric object or not
 */
export const parsePasteObject = data => {
  const jsonData = getJson(data);
  return jsonData[COPY_OBJECT_KEY] || {};
};
