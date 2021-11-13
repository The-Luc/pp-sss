import { graphqlRequest } from '../urql';

import { saveSettingMutation } from './mutations';

import { portraitSettingsMappingToApi } from '@/common/mapping';

import { isOk } from '@/common/utils';

/**
 * Save layout id to favorites
 *
 * @param   {Number | String} id  id of selected layout
 * @returns {Object}              mutation result
 */
export const saveSettings = async (bookId, params) => {
  const res = await graphqlRequest(saveSettingMutation, {
    bookId,
    params: portraitSettingsMappingToApi(params)
  });

  return isOk(res);
};
