import { get } from 'lodash';
import { graphqlRequest } from '../urql';
import { getFontsQuery } from './queries';
import { isEmpty } from '@/common/utils';

export const getFontsApi = async () => {
  const res = await graphqlRequest(getFontsQuery);
  const fonts = get(res, 'data.fonts', []);

  if (isEmpty(fonts)) return [];

  return fonts.map(({ name, id }) => ({ name, id }));
};
