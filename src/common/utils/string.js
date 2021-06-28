import { COPY_OBJECT_KEY } from '../constants/config';

/**
 * The function check data can parse to JSON or not and return object be parse
 * @param {String} str Data as string
 * @returns {Object} Data as JSON
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
 * @param {String} data Paste data
 * @returns {Object} Data is parse to JSON
 */
export const parsePasteObject = data => {
  const jsonData = getJson(data);

  if (!jsonData) return {};

  return jsonData[COPY_OBJECT_KEY];
};
