import { graphqlRequest } from '../urql';

import { saveUserTextStylesMutation } from './mutations';
import { get } from 'lodash';
import { textStyleMapping } from '@/common/mapping';

export const saveUserTextStyleApi = async style => {
  const res = await graphqlRequest(saveUserTextStylesMutation, {
    params: style
  });

  const userStyle = get(res, 'data.create_text_style', []);
  return textStyleMapping(userStyle);
};
