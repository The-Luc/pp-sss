export const useMappingTemplate = () => {
  const createTemplateMapping = async (printId, digitalId, overlayData) => {
    const textValues = {};
    const imageValues = {};

    Object.values(overlayData).forEach(o => {
      if (!o.value || o.value === -1) return; // is unassigned option

      const values = o.isImage ? imageValues : textValues;
      const index = o.isPrint ? 0 : 1;

      if (!Array.isArray(values[o.value])) {
        values[o.value] = [];
      }

      values[o.value][index] = o.id;
    });

    // const mappingParams = '';

    // const params = { printId, digitalId, mappingParams };
  };
  return { createTemplateMapping };
};
