import { graphqlRequest } from '../urql';

import {
  saveSettingMutation,
  addBookPortraitMutation,
  createPortraitSheetMutation,
  deletePortraitSheetMutation
} from './mutations';
import { getPortraitFoldersIdSelected } from './api_query';
import { isEmpty, isOk } from '@/common/utils';

import { portraitSettingsMappingToApi } from '@/common/mapping';

/**
 * Save layout id to favorites
 *
 * @param   {Number | String} id  id of selected layout
 * @returns {Object}              mutation result
 */
export const savePortraitSettingsApi = async (bookId, params) => {
  const res = await graphqlRequest(saveSettingMutation, {
    bookId,
    params: portraitSettingsMappingToApi(params)
  });

  return isOk(res);
};

/**
 * Add folder portrait id to book portrait collections
 *
 * @param   {Number | String} bookId  id of book
 * @param   {Array}           folderIds  array id of portrait folder selected
 * @returns {Object}              mutation result
 */
export const saveSelectedPortraitFolders = async (bookId, folderIds) => {
  const portraitFoldersIdSelected = await getPortraitFoldersIdSelected(bookId);
  const selectedFolderIds = folderIds.filter(
    folder => !portraitFoldersIdSelected.includes(folder)
  );

  if (isEmpty(selectedFolderIds)) return;

  const promises = selectedFolderIds.map(id =>
    graphqlRequest(addBookPortraitMutation, {
      bookPotraitParams: {
        book_id: bookId,
        portrait_collection_id: id
      }
    })
  );

  return Promise.all(promises);
};

/**
 * Save portrait collections which apply on a sheet for portrait mapping
 */
export const createPortraitSheetApi = (sheetId, collections) => {
  return graphqlRequest(createPortraitSheetMutation, {
    sheetId,
    collections
  });
};

export const deletePortraitSheetApi = id => {
  if (!id) return;

  return graphqlRequest(deletePortraitSheetMutation, { id });
};
