import { graphqlRequest } from '../urql';

import { saveSettingMutation, addBookPortrait } from './mutations';
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
 * @param   {Number} FolderIds  array id of portrait folder selected
 * @returns {Object}              mutation result
 */
export const saveSelectedPortraitFolders = async (bookId, FolderIds) => {
  const portraitFoldersIdSelected = await getPortraitFoldersIdSelected(bookId);
  const selectedFolderIds = FolderIds.filter(
    folder => !portraitFoldersIdSelected.includes(folder)
  );

  if (isEmpty(selectedFolderIds)) return;

  return await Promise.all(
    selectedFolderIds
      .map(id =>
        graphqlRequest(
          addBookPortrait,
          {
            bookPotraitParams: {
              book_id: bookId,
              portrait_collection_id: id
            }
          },
          true
        )
      )
      .then(res => isOk(res))
  );
};
