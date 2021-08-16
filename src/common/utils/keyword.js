import { uniq } from 'lodash';

export const listKeywords = array => {
  const listKeyword = array
    .join(' ')
    .split(' ')
    .filter(Boolean);

  const uniqListKeyword = uniq(listKeyword).map(keyword => ({
    value: keyword,
    active: true
  }));

  return uniqListKeyword;
};
