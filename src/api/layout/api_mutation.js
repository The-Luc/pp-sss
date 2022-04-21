import { graphqlRequest } from '../urql';
import {
  saveUserDigitalLayoutMutation,
  saveUserLayoutMutation
} from './mutations';
import { isOk } from '@/common/utils';

/**
 * To save a custom layout
 *
 * @param {String} id id of page or sheet
 * @param {String} type value: SHEET or PAGE
 * @param {String} name custom title of layout
 * @param {String} previewImageUrl thumbnail for saved layout
 * @param {Boolean} isCover whether a cover layout or not
 * @returns mutation results
 */
export const saveCustomPrintLayoutApi = async (
  id,
  type,
  title,
  previewImageUrl,
  isCover
) => {
  const layoutUse = isCover ? 'COVER' : 'MISC';
  const res = await graphqlRequest(saveUserLayoutMutation, {
    id,
    type,
    title,
    previewImageUrl,
    layoutUse
  });
  return isOk(res);
};

export const saveCustomDigitalLayoutApi = async varibles => {
  const res = await graphqlRequest(saveUserDigitalLayoutMutation, varibles);

  return isOk(res);
};
