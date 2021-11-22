import { get } from 'lodash';
import { graphqlRequest } from '../urql';
import { getPageLayoutQuery } from './query';

export const getPageLayoutApi = async pageId => {
  if (!pageId) return;
  const res = await graphqlRequest(getPageLayoutQuery, { pageId });

  return get(res, 'data.page.layout', {});
};
