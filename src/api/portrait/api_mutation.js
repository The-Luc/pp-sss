import { graphqlRequest } from '../urql';

import { saveSettingMutation, addBookPortraitMutation } from './mutations';
import { getPortraitFoldersIdSelected } from './api_query';
import { isEmpty } from '@/common/utils';

import { portraitSettingsMappingToApi } from '@/common/mapping';

import { isOk } from '@/common/utils';

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
 * add folder portrait id to book portrait collections
 *
 * @param   {Number} bookId  id of book
 * @param   {Number} folderIds  array id of portrait folder selected
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

  return await Promise.all(promises).then(res => isOk(res));
};
