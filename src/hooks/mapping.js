import { createTemplateMappingApi } from '@/api/mapping';
import { cloneDeep } from 'lodash';
import { isEmpty } from '@/common/utils';

export const useMappingTemplate = () => {
  const createTemplateMapping = async (printId, frameIds, overlayData) => {
    const textValues = {};
    const imageValues = {};

    // adding print object ids
    Object.values(overlayData).forEach(o => {
      if (!o.value || o.value === -1 || !o.isPrint) return; // is unassigned option
      const values = o.isImage ? imageValues : textValues;

      values[o.value] = [];
      values[o.value][0] = o.id;
    });

    // adding digital object ids

    const createMappingPromise = frameIds.map(frameId => {
      const cloneTextValues = cloneDeep(textValues);
      const cloneImageValues = cloneDeep(imageValues);
      const mappingParams = [];

      Object.values(overlayData).forEach(o => {
        if (
          !o.value ||
          o.value === -1 ||
          o.isPrint ||
          o.containerId !== frameId
        )
          return; // is unassigned option

        const values = o.isImage ? cloneImageValues : cloneTextValues;

        if (!Array.isArray(values[o.value])) {
          values[o.value] = [];
        }

        values[o.value][1] = o.id;
      });

      const addingParams = values => {
        Object.values(values).forEach(o => {
          const print_element_uid = o[0];
          const digital_element_uid = o[1];

          if (!print_element_uid || !digital_element_uid) return;

          mappingParams.push({ print_element_uid, digital_element_uid });
        });
      };

      addingParams(cloneTextValues);
      addingParams(cloneImageValues);

      const params = { printId, frameId, mappingParams };

      if (isEmpty(mappingParams)) return [];

      return createTemplateMappingApi(params);
    });

    await Promise.all(createMappingPromise);
  };

  return { createTemplateMapping };
};
