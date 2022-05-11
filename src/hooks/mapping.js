import { createTemplateMappingApi } from '@/api/mapping';
import { isEmpty } from '@/common/utils';

export const useMappingTemplate = () => {
  const createTemplateMapping = async (printId, digitalId, overlayData) => {
    const textValues = {};
    const imageValues = {};
    const mappingParams = [];

    Object.values(overlayData).forEach(o => {
      if (!o.value || o.value === -1) return; // is unassigned option

      const values = o.isImage ? imageValues : textValues;
      const index = o.isPrint ? 0 : 1;

      if (!Array.isArray(values[o.value])) {
        values[o.value] = [];
      }

      values[o.value][index] = o.id;
    });

    const addingParams = values => {
      Object.values(values).forEach(o => {
        const print_element_uid = o[0];
        const digital_element_uid = o[1];

        if (!print_element_uid || !digital_element_uid) return;

        mappingParams.push({ print_element_uid, digital_element_uid });
      });
    };

    addingParams(textValues);
    addingParams(imageValues);

    const params = { printId, digitalId, mappingParams };

    if (!printId || !digitalId || isEmpty(mappingParams)) return;

    await createTemplateMappingApi(params);
  };

  return { createTemplateMapping };
};
