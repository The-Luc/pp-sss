import { PROPERTIES_TOOLS } from '@/common/constants';
import { isEmpty } from '@/common/utils';
import { MAPPING_TYPES, PRIMARY_FORMAT_TYPES } from '../constants/mapping';

/**
 * Mutate the items tool to update the mapping icon
 *
 * @param {Object} config mapping config
 * @param {Array} itemsTool item tool data
 * @returns modified items tool
 */
export const getMappingIconName = (config, itemsTool) => {
  if (isEmpty(config)) return;
  const contentMapping = config.enableContentMapping;

  const mapping = itemsTool
    .flat()
    .find(item => item.name === PROPERTIES_TOOLS.MAPPING.name);
  mapping.iconName = contentMapping ? 'gps_fixed' : 'location_disabled';
};

/**
 *  Allowing sync data condition:
 * - MAPPING FUNCTIONALITY is on
 * - MAPPING STATUS is on
 * - MAPPING TYPE is LAYOUT
 *
 */
export const isAllowSyncData = (projectConfig, sheetConfig) => {
  const { enableContentMapping } = projectConfig;

  const { mappingType, mappingStatus } = sheetConfig;

  const isLayoutMapping = mappingType === MAPPING_TYPES.LAYOUT.value;

  return enableContentMapping && mappingStatus && isLayoutMapping;
};

export const isSecondaryFormat = (projectConfig, isDigital) => {
  const { primaryMapping } = projectConfig;

  return isDigital
    ? PRIMARY_FORMAT_TYPES.PRINT.value === primaryMapping
    : PRIMARY_FORMAT_TYPES.DIGITAL.value === primaryMapping;
};

/**
 * update canvas objects `mapping info` to display mapping icon correctly
 */
export const updateCanvasMapping = (elementIds, canvas) => {
  const ids = Array.isArray(elementIds) ? elementIds : [elementIds];

  const fbObjects = canvas.getObjects();

  fbObjects.forEach(fb => {
    if (ids.includes(fb.id)) fb.mappingInfo.mapped = false;
  });

  canvas.renderAll();
};
