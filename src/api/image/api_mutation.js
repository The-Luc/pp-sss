import { get } from 'lodash';
import { graphqlRequest } from '../urql';

import { saveUserImageStylesMutation } from './mutations';
import { imageStyleMapping } from '@/common/mapping';
import { isOk } from '@/common/utils';

export const saveUserImageStyleApi = async style => {
  const res = await graphqlRequest(saveUserImageStylesMutation, {
    params: style
  });

  if (!isOk(res)) return;

  const userStyle = get(res, 'data.create_image_style', []);
  return imageStyleMapping(userStyle);
};
