import { get } from 'lodash';
import { graphqlRequest } from '../urql';
import { getPageLayoutQuery, getSheetIdOfPageQuery } from './query';

export const getPageLayoutApi = async pageId => {
  if (!pageId) return;
  const res = await graphqlRequest(getPageLayoutQuery, { pageId });

  return get(res, 'data.page.layout', {});
};

export const getSheetIdOfPage = async pageId => {
  const res = await graphqlRequest(getSheetIdOfPageQuery, { pageId });
  return get(res, 'data.page.sheets[0]', null);
};
