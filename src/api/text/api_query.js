import { get } from 'lodash';
import { graphqlRequest } from '../urql';
import { getFontsQuery, getTextStyleQuery } from './queries';
import { isEmpty } from '@/common/utils';
import { textStyleMapping } from '@/common/mapping/styles';

export const getFontsApi = async () => {
  const res = await graphqlRequest(getFontsQuery);
  const fonts = get(res, 'data.fonts', []);

  if (isEmpty(fonts)) return [];

  return fonts.map(({ name, id }) => ({ name, id }));
};

export const getTextStyleApi = async () => {
  const res = await graphqlRequest(getTextStyleQuery);
  return res.data.text_styles.map(style => textStyleMapping(style));
};
