import { get } from 'lodash';
import { graphqlRequest } from '../urql';
import { getUserImageStyleQuery } from './queries';
import { isOk } from '@/common/utils';
import { imageStyleMapping } from '@/common/mapping/styles';
import { MAX_SAVED_IMAGE_STYLES } from '@/common/constants/config';

export const getUserImageStyleApi = async () => {
  const res = await graphqlRequest(getUserImageStyleQuery);

  if (!isOk(res)) return [];

  const styles = get(res, 'data.user_image_styles').map(imageStyleMapping);

  return styles.slice(-MAX_SAVED_IMAGE_STYLES);
};
