import { toLower, uniqBy } from 'lodash';

export const getUniqueKeywords = array => {
  const listKeyword = array
    .join(' ')
    .split(' ')
    .filter(Boolean);

  const uniqListKeyword = uniqBy(listKeyword, toLower).map(keyword => ({
    value: keyword,
    active: true
  }));

  return uniqListKeyword;
};
