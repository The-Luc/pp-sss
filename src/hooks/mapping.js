import {
  createTemplateMappingApi,
  deleteTemplateMappingApi,
  getMappingConfigApi,
  getSheetMappingConfigApi,
  updateMappingProjectApi,
  updateSheetMappingConfigApi,
  createElementMappingApi,
  getSheetMappingElementsApi,
  deleteElementMappingApi,
  updateElementMappingsApi,
  getBookConnectionsApi
} from '@/api/mapping';
import { cloneDeep, get } from 'lodash';
import { isEmpty, isPpTextOrImage } from '@/common/utils';
import {
  projectMapping,
  projectMappingToApi,
  sheetMappingConfigMapping,
  sheetMappingConfigToApiMapping
} from '@/common/mapping/mapping';
import { useAppCommon } from '@/hooks';
import { PRIMARY_FORMAT_TYPES } from '@/common/constants';
import { getSheetInfoApi } from '@/api/sheet';

const addingParams = values => {
  const mappingParams = [];

  Object.values(values).forEach(o => {
    const print_element_uid = o[0];
    const digital_element_uid = o[1];

    if (!print_element_uid || !digital_element_uid) return;

    mappingParams.push({ print_element_uid, digital_element_uid });
  });

  return mappingParams;
};

/**
 *  To create params for creating mapping APIs
 *
 * @param {Object} objects
 * @param {Object} cloneTextValues
 * @param {Object} cloneImageValues
 * @param {String} printId  id of print layout
 * @param {String} frameId  id of digital frame
 * @returns
 */
const getParams = (
  objects,
  cloneTextValues,
  cloneImageValues,
  printId,
  frameId
) => {
  objects.forEach(o => {
    if (isUnassigned(o) || o.containerId !== frameId) return; // is unassigned option

    const values = o.isImage ? cloneImageValues : cloneTextValues;

    if (!Array.isArray(values[o.value])) {
      values[o.value] = [];
    }

    values[o.value][1] = o.id;
  });

  const mappingParams = [
    ...addingParams(cloneTextValues),
    ...addingParams(cloneImageValues)
  ];

  return { printId, frameId, mappingParams };
};

const isUnassigned = o => !o.value || o.value === -1;

/* HOOK for MAPPINGS */
export const useMappingTemplate = () => {
  /* DELETE TEMPLATE MAPPINGS */
  const deleteTemplateMapping = config => {
    if (!config?.elementMappings) return;

    const ids = config.elementMappings.map(el => el.id);
    return deleteTemplateMappingApi(ids);
  };

  /* CREATE TEMPLATE MAPPINGS */
  const createTemplateMapping = async (
    printId,
    frameIds,
    overlayData,
    config
  ) => {
    // delete exisitng mappings
    await deleteTemplateMapping(config);

    const textValues = {};
    const imageValues = {};
    const printObjects = [];
    const digitalObjects = [];

    Object.values(overlayData).forEach(o => {
      if (o.isPrint) return printObjects.push(o);

      digitalObjects.push(o);
    });

    // adding print object ids
    printObjects.forEach(o => {
      if (isUnassigned(o)) return; // is unassigned option

      const values = o.isImage ? imageValues : textValues;

      values[o.value] = [];
      values[o.value][0] = o.id;
    });

    // adding digital object ids
    const createMappingPromise = frameIds.map(frameId => {
      const cloneTextValues = cloneDeep(textValues);
      const cloneImageValues = cloneDeep(imageValues);

      const params = getParams(
        digitalObjects,
        cloneTextValues,
        cloneImageValues,
        printId,
        frameId
      );

      if (isEmpty(params.mappingParams)) return [];

      return createTemplateMappingApi(params);
    });

    await Promise.all(createMappingPromise);
  };

  return { createTemplateMapping, deleteTemplateMapping };
};

export const useMappingProject = () => {
  /* GET CONFIG */
  const { generalInfo } = useAppCommon();
  const { breakAllConnections } = useBreakConnections();

  const getMappingConfig = async id => {
    const bookId = id || generalInfo.value.bookId;

    if (!bookId) return {};

    const res = await getMappingConfigApi(bookId);

    let config = get(res, 'data.book.project_mapping_configuration');

    // if config is NULL => need to give it a default value
    if (!config) {
      const defaultConfig = {
        primaryMapping: PRIMARY_FORMAT_TYPES.PRINT.value,
        enableContentMapping: true
      };

      config = await updateMappingProject(bookId, defaultConfig);
    }

    return projectMapping(config);
  };

  /* UPDATE CONFIG */
  const updateMappingProject = async (id, config) => {
    const bookId = id || generalInfo.value.bookId;
    const params = projectMappingToApi(config);

    const res = await updateMappingProjectApi(bookId, params);

    if (!config.enableContentMapping) {
      // if use set mapping functionality is OFF => set `mapped` field of element mapping to FALSE
      await breakAllConnections(bookId);
    }

    const newConfig = get(res, 'data.update_project_mapping_configuration');

    return projectMapping(newConfig);
  };

  return { getMappingConfig, updateMappingProject };
};

export const useMappingSheet = () => {
  const { getMappingConfig } = useMappingProject();

  const getSheetMappingConfig = async sheetId => {
    const res = await getSheetMappingConfigApi(sheetId);

    const config = get(res, 'data.sheet');
    return sheetMappingConfigMapping(config);
  };

  const updateSheetMappingConfig = async (sheetId, config) => {
    const params = sheetMappingConfigToApiMapping(config);

    return updateSheetMappingConfigApi(sheetId, params);
  };

  const getElementMappings = async sheetId => {
    return getSheetMappingElementsApi(sheetId);
  };

  const createElementMappings = async (
    sheetId,
    mappings,
    printObjectList,
    frames
  ) => {
    const printMappings = {};
    const digitalMappings = {};

    printObjectList.filter(isPpTextOrImage).forEach(o => {
      printMappings[o.idFromLayout] = { print_element_uid: o.id };
    });

    const frameIds = [];
    frames.forEach(frame => {
      frameIds.push(frame.id);
      frame.objects.filter(isPpTextOrImage).forEach(o => {
        digitalMappings[o.idFromLayout] = {
          digital_element_uid: o.id,
          digital_frame_id: frame.id
        };
      });
    });

    const apiMappings = {};

    mappings.elementMappings.forEach(({ printElementId, digitalElementId }) => {
      const { print_element_uid } = printMappings[printElementId] || {};
      const { digital_element_uid, digital_frame_id } =
        digitalMappings[digitalElementId] || {};

      if (!print_element_uid || !digital_element_uid) return;

      if (!apiMappings[digital_frame_id]) apiMappings[digital_frame_id] = [];

      // group mapping by digital frame id
      apiMappings[digital_frame_id].push({
        print_element_uid,
        digital_element_uid
      });
    });

    // call API to create element mappings
    await frameIds.reduce(async (acc, frameId) => {
      await acc;

      const config = apiMappings[frameId];

      if (!config) return;

      await createElementMappingApi(sheetId, frameId, config);
    }, Promise.resolve());
  };

  const deleteElementMappings = async ids => {
    if (isEmpty(ids)) return;

    return deleteElementMappingApi(ids);
  };

  const updateElementMappings = async (
    sheetId,
    mappings,
    printObjects,
    frames
  ) => {
    // get current element mappings
    const elementMappings = await getElementMappings(sheetId);

    // delete current element mappings
    await deleteElementMappings(elementMappings.map(e => e.id));

    // create new element mappings
    await createElementMappings(sheetId, mappings, printObjects, frames);
  };

  // save sheet element mappings to vuex
  const storeElementMappings = async sheetId => {
    const elementMappings = await getElementMappings(sheetId);
    const elementMappingConfig = cloneDeep(elementMappings);

    const sheetConfig = await getSheetMappingConfig(sheetId);
    const projectConfig = await getMappingConfig();

    const { mappingStatus } = sheetConfig;
    const { enableContentMapping } = projectConfig;

    elementMappingConfig.forEach(el => {
      if (!mappingStatus || !enableContentMapping) {
        el.mapped = false;
      }

      if (!el.digitalElementId || !el.printElementId) {
        el.mapped = false;
      }
    });

    return elementMappingConfig;
  };

  // remove mapping either on print objects or digital objects
  const updateElementMappingByIds = async (ids, isDigital) => {
    const prop = isDigital ? 'digitalElementId' : 'printElementId';

    const promises = ids.map(id =>
      updateElementMappingsApi(id, { [prop]: '' })
    );

    return Promise.all(promises);
  };

  /**
   * Delete element mapping on a page
   * Used when applying portrait on a page
   *
   *  - Get sheet objects and element mappings of sheet
   *  if printElementIds are not in sheet objects ids => the objects has been removed
   *       => remove it from the element mappings
   *
   */
  const removeElementMappingOfPage = async sheetId => {
    const elementMappings = await getElementMappings(sheetId);

    const sheet = await getSheetInfoApi(sheetId);

    const objectIds = sheet.objects.map(o => o.id);

    const mappingIds = elementMappings.reduce((acc, el) => {
      if (!objectIds.includes(el.printElementId)) acc.push(el.id);

      return acc;
    }, []);

    // change printElementId of ids in mappingIds to ''
    await updateElementMappingByIds(mappingIds);
  };

  /**
   * Delete element mapping on frames
   * Used when applying portrait on frames
   *
   * @param {Array} frameIds ids of frames which portraits are applied on
   *
   */
  const removeElementMapingOfFrames = async (sheetId, frameIds) => {
    const elementMappings = await getElementMappings(sheetId);

    const mappingIds = elementMappings.reduce((acc, el) => {
      if (frameIds.includes(el.digitalContainerId)) acc.push(el.id);
      return acc;
    }, []);

    await updateElementMappingByIds(mappingIds, true);
  };

  return {
    getSheetMappingConfig,
    updateSheetMappingConfig,
    updateElementMappings,
    getElementMappings,
    storeElementMappings,
    updateElementMappingByIds,
    removeElementMappingOfPage,
    removeElementMapingOfFrames
  };
};

export const useBreakConnections = () => {
  const breakAllConnections = async bookId => {
    const connectionIds = await getBookConnectionsApi(bookId);

    if (isEmpty(connectionIds)) return;

    await Promise.all(
      connectionIds.map(id => updateElementMappingsApi(id, { mapped: false }))
    );
  };
  return { breakAllConnections };
};
