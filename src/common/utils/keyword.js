import { toLower, uniqBy } from 'lodash';

export const getUniqueKeywords = array => {
  const listKeyword = array
    .join(' ')
    .split(' ')
    .filter(Boolean);

  return uniqBy(listKeyword, toLower).map(keyword => ({
    value: keyword,
    active: true
  }));
};
