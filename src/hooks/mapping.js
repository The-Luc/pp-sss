import { createTemplateMappingApi } from '@/api/mapping';
import { cloneDeep } from 'lodash';
import { isEmpty } from '@/common/utils';

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
  const deleteTemplateMapping = async config => {
    // handle logic here
    console.log('handle delete mapping ', config);
  };
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

  return { createTemplateMapping };
};
