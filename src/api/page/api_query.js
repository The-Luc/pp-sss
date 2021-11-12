import { get } from 'lodash';
import { graphqlRequest } from '../urql';
import { getPageAPILayoutQuery } from './query';

export const getPageAPILayout = async pageId => {
  if (!pageId) return;
  const res = await graphqlRequest(getPageAPILayoutQuery, { pageId });

  return get(res, 'data.page.layout', {});
};
