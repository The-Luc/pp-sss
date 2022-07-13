import { get } from 'lodash';
import { STATUS } from '@/common/constants';
import { isOk } from '@/common/utils';
import { graphqlRequest } from '../urql';

import {
  generateBookPdfQuery,
  getPresetColorPickerQuery,
  getUploadTokenQuery
} from './queries';
import {
  savePresetColorPickerMutation,
  uploadBase64ImageMutation
} from './mutations';

/**
 *  To upload base64 images to server and get back url
 *
 * @param {String} base64 data of image in base64
 * @returns url of image after uploading on server
 */
export const uploadBase64ImageApi = async base64 => {
  if (!base64 || !base64.startsWith('data:image/')) return base64;

  try {
    const res = await graphqlRequest(uploadBase64ImageMutation, {
      base64
    });
    if (!isOk(res))
      throw new Error('Cannot generate image url from base64 image');

    const url = get(res, 'data.upload_base64_image.versions.original.url', '');

    return { data: url, status: STATUS.OK };
  } catch (error) {
    return { data: null, status: STATUS.NG };
  }
};

/**
 *  To get presets color of color picker
 *
 * @returns Array of preset colors of color picker
 */
export const getPresetsColorPickerApi = async () => {
  const res = await graphqlRequest(getPresetColorPickerQuery);

  return get(res, 'data.user_favourite_colors', []);
};

/**
 * To save color of color picker to DB
 *
 * @param {Promise<Array<String>>} colors array of string - hex colors
 */
export const savePresetColorPickerApi = async colors => {
  return graphqlRequest(savePresetColorPickerMutation, { colors }, true);
};

/**
 *  To trigger pdf generation job
 *
 * @param {String} id id of book or page will be created pdf from.
 * @returns response result
 */
export const generatePdfApi = async id => {
  const res = await graphqlRequest(
    generateBookPdfQuery,
    { bookId: id },
    false,
    true
  );
  return isOk(res);
};

/**
 * To get uploader token to upload assets
 *
 * @returns data of Platypus uploader token
 */
export const getUploadTokenApi = async () => {
  const res = await graphqlRequest(getUploadTokenQuery, {}, true);

  if (!isOk(res)) return;

  return res.data.uploader_token;
};
