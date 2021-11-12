import { get } from 'lodash';
import { graphqlRequest } from '../urql';
import { updatePageMutation } from './mutation';
import { getPageAPILayoutQuery } from './query';
import { getPageAPILayout } from '.';
import { mapSheetToPages } from '@/common/utils';
import { STATUS } from '@/common/constants';

export const updatePagesOfSheet = async sheetData => {
  const [leftPageId, rightPageId] = sheetData?.sheetProps?.pageIds;
  const { leftPage, rightPage } = mapSheetToPages(sheetData);

  if (!leftPageId && !rightPageId) return { status: STATUS.NG };

  const updatePage = async (pageId, pageData) => {
    if (!pageId) return { status: STATUS.NG };

    const layout = await getPageAPILayout(pageId);
    const arg = {
      pageId,
      params: {
        layout: JSON.stringify({ ...layout, ...pageData })
      }
    };
    return await graphqlRequest(updatePageMutation, arg);
  };

  return await Promise.all([
    updatePage(leftPageId, leftPage),
    updatePage(rightPageId, rightPage)
  ]);
};

/**
 *  To update page workspace / media
 * @param {String} pageId page id
 * @param {Array} workspace array of assets in the sheet (left page)
 * @returns  response page data
 */
export const updatePageWorkspace = async (pageId, workspace) => {
  const response = await graphqlRequest(getPageAPILayoutQuery, { pageId });

  const dbLayout = get(response, 'data.page.layout', []);

  const params = { layout: JSON.stringify({ ...dbLayout, workspace }) };

  return await graphqlRequest(updatePageMutation, { pageId, params });
};
