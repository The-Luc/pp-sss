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

export const isAllowSyncData = (projectConfig, sheetConfig, isDigital) => {
  const { enableContentMapping, primaryMapping } = projectConfig;

  const { mappingType, mappingStatus } = sheetConfig;

  const isLayoutMapping = mappingType === MAPPING_TYPES.LAYOUT.value;

  const isPrimaryFormat = isDigital
    ? PRIMARY_FORMAT_TYPES.DIGITAL.value === primaryMapping
    : PRIMARY_FORMAT_TYPES.PRINT.value === primaryMapping;

  return (
    isPrimaryFormat && enableContentMapping && mappingStatus && isLayoutMapping
  );
};
