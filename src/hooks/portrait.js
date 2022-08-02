import {
  deletePortraitSheetApi,
  getPortraitFoldersApi,
  saveSelectedPortraitFolders,
  sheetPortraitApi,
  createPortraitSheetApi
} from '@/api/portrait';
import { useMappingProject } from './mapping';

export const usePortrait = () => {
  const { getMappingConfig } = useMappingProject();

  const getAndRemovePortraitSheet = async sheetId => {
    const portraitIds = await sheetPortraitApi(sheetId);
    console.log('portraits', portraitIds);
    const fakeId = 1;
    // deletePortraitSheetApi(fakeId);
    return portraitIds;
  };

  const createPortraitSheet = async (sheetId, collectionIds) => {
    const { enableContentMapping } = await getMappingConfig();

    // only create portrait sheet mapping if mapping functionality is ON
    if (!enableContentMapping) return;

    return createPortraitSheetApi(sheetId, collectionIds);
  };
  return {
    getPortraitFolders: getPortraitFoldersApi,
    saveSelectedPortraitFolders,
    getAndRemovePortraitSheet,
    createPortraitSheet: createPortraitSheetApi
  };
};
