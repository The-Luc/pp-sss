import { graphqlRequest } from '../urql';
import { saveUserLayoutMutation } from './mutations';
import { isOk } from '@/common/utils';

/**
 * To save a custom layout
 *
 * @param {String} id id of page or sheet
 * @param {String} type value: SHEET or PAGE
 * @param {String} name custom title of layout
 * @param {String} previewImageUrl thumbnail for saved layout
 * @returns mutation results
 */
export const saveCustomPrintLayoutApi = async (
  id,
  type,
  title,
  previewImageUrl
) => {
  const res = await graphqlRequest(saveUserLayoutMutation, {
    id,
    type,
    title,
    previewImageUrl
  });
  return isOk(res);
};
