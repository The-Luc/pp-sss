import { graphqlRequest } from '../urql';
import { saveUserLayoutMutation } from './mutations';
import { isOk } from '@/common/utils';

/**
 * To save a custom layout
 *
 * @param {String} id id of page or sheet
 * @param {String} type value: SHEET or PAGE
 * @returns mutation results
 */
export const saveCustomPrintLayoutApi = async (id, type) => {
  const res = await graphqlRequest(saveUserLayoutMutation, { id, type });
  return isOk(res);
};
