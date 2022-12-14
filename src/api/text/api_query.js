import { get } from 'lodash';
import { graphqlRequest } from '../urql';
import {
  getFontsQuery,
  getTextStyleQuery,
  getUserTextStyleQuery
} from './queries';
import { isEmpty } from '@/common/utils';
import { textStyleMapping } from '@/common/mapping/styles';
import { MAX_SAVED_TEXT_STYLES } from '@/common/constants/config';

export const getFontsApi = async () => {
  const res = await graphqlRequest(getFontsQuery);
  const fonts = get(res, 'data.fonts', []);

  if (isEmpty(fonts)) return [];

  return fonts.map(({ name, id }) => ({ name, id }));
};

export const getTextStyleApi = async () => {
  const res = await graphqlRequest(getTextStyleQuery);
  return res.data.text_styles.map(textStyleMapping);
};

export const getUserTextStyleApi = async () => {
  const res = await graphqlRequest(getUserTextStyleQuery);

  const styles = res.data.user_text_styles.map(textStyleMapping);

  return styles.slice(-MAX_SAVED_TEXT_STYLES);
};
