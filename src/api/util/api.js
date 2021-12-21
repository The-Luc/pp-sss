import { get } from 'lodash';
import { STATUS } from '@/common/constants';
import { isOk } from '@/common/utils';
import { graphqlRequest } from '../urql';
import { uploadBase64ImageMutation } from './mutations';

export const uploadBase64ImageApi = async (base64, isAutosave) => {
  if (!base64 || !base64.startsWith('data:image/')) return base64;

  try {
    const res = await graphqlRequest(
      uploadBase64ImageMutation,
      {
        base64
      },
      isAutosave
    );
    if (!isOk(res))
      throw new Error('Cannot generate image url from base64 image');

    return get(res, 'data.upload_base64_image.versions.original.url', '');
  } catch (error) {
    return { data: null, status: STATUS.NG };
  }
};
