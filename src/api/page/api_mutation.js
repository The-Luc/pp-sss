import { graphqlRequest } from '../urql';
import { updatePageMutation } from './mutation';
import { STATUS } from '@/common/constants';

/**
 * Used to save portrait objects and preview thumbnails
 *
 * @param {Object} sheetData
 * @returns response data
 */
export const updatePageApi = async (pageId, pageData) => {
  if (!pageId) return { status: STATUS.NG };

  const arg = {
    pageId,
    params: {
      ...pageData,
      layout: JSON.stringify(pageData.layout)
    }
  };
  return graphqlRequest(updatePageMutation, arg);
};
