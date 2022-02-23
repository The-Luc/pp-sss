import { graphqlRequest } from '../urql';

import { saveUserTextStylesMutation } from './mutations';
import { get } from 'lodash';
import { textStyleMapping } from '@/common/mapping';
import { isOk } from '@/common/utils';

export const saveUserTextStyleApi = async style => {
  const res = await graphqlRequest(saveUserTextStylesMutation, {
    params: style
  });

  if (!isOk) return;

  const userStyle = get(res, 'data.create_text_style', []);
  return textStyleMapping(userStyle);
};
