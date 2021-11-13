import { isEmpty } from '@/common/utils';
import { graphqlRequest } from '../urql';
import { getClipArts, getClipartCategories, searchClipArt } from './queries';

/**
 * To get list clipart by id of caregory
 * @param {String} id id of category
 * @returns array of object containing list clipart
 */
export const loadClipArtsApi = async id => {
  const res = await graphqlRequest(getClipArts, { id });
  return res.data.category.cliparts;
};

/**
 * To get list caregory of clipart
 * @returns array of object containing list categories
 */
export const loadClipArtCategoriesApi = async () => {
  const res = await graphqlRequest(getClipartCategories);
  return res.data.categories;
};

/**
 * To get list clipart by keyword
 * @param {String} keyword keyword to search
 * @returns array of object containing list clipart
 */
export const searchClipArtApi = async keyword => {
  if (isEmpty(keyword)) return [];

  const res = await graphqlRequest(searchClipArt, { keyword });
  const category_keyword = res.data.category_keyword;

  return isEmpty(category_keyword) ? [] : category_keyword.cliparts;
};
