import { useGetters, useMutations } from 'vuex-composition-helpers';
import {
  GETTERS as PRINT_GETTERS,
  MUTATES as PRINT_MUTATES
} from '@/store/modules/print/const';
import {
  GETTERS as DIGITAL_GETTERS,
  MUTATES as DIGITAL_MUTATES
} from '@/store/modules/digital/const';
import {
  createTemplateMappingApi,
  deleteTemplateMappingApi,
  getMappingConfigApi,
  getSheetMappingConfigApi,
  updateMappingProjectApi,
  updateSheetMappingConfigApi,
  createElementMappingApi,
  getSheetMappingElementsApi,
  deleteElementMappingApi
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

    const newConfig = get(res, 'data.update_project_mapping_configuration');

    return projectMapping(newConfig);
  };

  return { getMappingConfig, updateMappingProject };
};

export const useMappingSheet = () => {
  const { value: isDigital } = useAppCommon().isDigitalEdition;

  const GETTERS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;
  const MUTATES = isDigital ? DIGITAL_MUTATES : PRINT_MUTATES;

  const { getElementMappings: getStoredElementMappings } = useGetters({
    getElementMappings: GETTERS.GET_ELEMENT_MAPPINGS
  });
  const { setElementMappings } = useMutations({
    setElementMappings: MUTATES.SET_ELEMENT_MAPPINGS
  });

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

    frames.map(frame => {
      frame.objects.filter(isPpTextOrImage).forEach(o => {
        digitalMappings[o.idFromLayout] = {
          digital_element_uid: o.id,
          digital_frame_id: frame.id
        };
      });
    });

    const apiMappings = mappings.elementMappings.map(
      ({ printElementId, digitalElementId }) => {
        const { print_element_uid } = printMappings[printElementId];
        const { digital_element_uid, digital_frame_id } = digitalMappings[
          digitalElementId
        ];
        return {
          sheet_id: sheetId,
          digital_frame_id,
          print_element_uid,
          digital_element_uid
        };
      }
    );
    // call API to create element mappings
    await Promise.all(
      apiMappings.map(config => createElementMappingApi(config))
    );
  };

  const deleteElementMappings = async ids => {
    if (isEmpty(ids)) return;

    return deleteElementMappingApi(ids);
  };

  const updateElementMappings = async (
    sheetId,
    mappings,
    printObject,
    frames
  ) => {
    // get current element mappings
    const elementMappings = await getElementMappings(sheetId);

    // delete current element mappings
    await deleteElementMappings(elementMappings.map(e => e.id));

    // create new element mappings
    await createElementMappings(sheetId, mappings, printObject, frames);
  };

  // save sheet element mappings to vuex
  const storeElementMappings = async sheetId => {
    const elementMappings = await getElementMappings(sheetId);

    setElementMappings({ elementMappings });
    return elementMappings;
  };

  return {
    getSheetMappingConfig,
    updateSheetMappingConfig,
    updateElementMappings,
    getElementMappings,
    storeElementMappings,
    getStoredElementMappings
  };
};
