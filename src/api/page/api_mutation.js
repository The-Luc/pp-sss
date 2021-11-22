import { get } from 'lodash';
import { graphqlRequest } from '../urql';
import { updatePageMutation } from './mutation';
import { getPageLayoutQuery } from './query';
import { STATUS } from '@/common/constants';

/**
 * To save sheet data to pages
 *
 * @param {Object} sheetData
 * @returns response data
 */
export const updatePageApi = async (pageId, pageData) => {
  if (!pageId) return { status: STATUS.NG };

  const arg = {
    pageId,
    params: {
      layout: JSON.stringify(pageData.layout),
      ...pageData.otherProps
    }
  };
  return await graphqlRequest(updatePageMutation, arg);
};

/**
 *  To update page workspace / media
 * @param {String} pageId page id
 * @param {Array} workspace array of assets in the sheet (left page)
 * @returns  response page data
 */
export const updatePageWorkspace = async (pageId, workspace) => {
  const response = await graphqlRequest(getPageLayoutQuery, { pageId });

  const dbLayout = get(response, 'data.page.layout', []);

  const params = { layout: JSON.stringify({ ...dbLayout, workspace }) };

  return await graphqlRequest(updatePageMutation, { pageId, params });
};
