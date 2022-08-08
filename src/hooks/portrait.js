import {
  deletePortraitSheetApi,
  getPortraitFoldersApi,
  saveSelectedPortraitFolders,
  sheetPortraitApi,
  createPortraitSheetApi
} from '@/api/portrait';
import { MAPPING_TYPES } from '@/common/constants';
import { isPortraitMappingChecker } from '@/common/utils';
import { useMappingProject, useMappingSheet } from './mapping';

export const usePortrait = () => {
  const { getMappingConfig } = useMappingProject();
  const { getSheetMappingConfig, updateSheetMappingConfig } = useMappingSheet();

  const getAndRemovePortraitSheet = async sheetId => {
    const { collectionIds, id } = await sheetPortraitApi(sheetId);
    // do not need to await for the delete api, cuz wont' effect the flow
    deletePortraitSheetApi(id);
    return collectionIds;
  };

  const createPortraitSheet = async (sheetId, collectionIds) => {
    const { enableContentMapping } = await getMappingConfig();

    // only create portrait sheet mapping if mapping functionality is ON
    if (!enableContentMapping) return;

    // remove previous portrait sheet setting if any
    const { id } = await sheetPortraitApi(sheetId);
    await deletePortraitSheetApi(id);

    // create portrait sheet settings
    return createPortraitSheetApi(sheetId, collectionIds);
  };

  /**
   * Status mapping will become OFF.
   * Mapping type will change to PORTRAIT Mapping => all the broken icon will disappear
   *
   * @param {String} sheetId
   */
  const setSheetPortraitConfig = async sheetId => {
    const sheetConfig = await getSheetMappingConfig(sheetId);

    const isPortraitMapping = isPortraitMappingChecker(sheetConfig);
    const isStatusMappingOff = !sheetConfig.mappingStatus;

    const config = {};

    if (!isPortraitMapping) config.mappingType = MAPPING_TYPES.PORTRAIT.value;
    if (!isStatusMappingOff) config.mappingStatus = false;

    await updateSheetMappingConfig(sheetId, config);
  };
  return {
    getPortraitFolders: getPortraitFoldersApi,
    saveSelectedPortraitFolders,
    getAndRemovePortraitSheet,
    createPortraitSheet,
    setSheetPortraitConfig
  };
};
