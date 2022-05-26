import { PROPERTIES_TOOLS } from '@/common/constants';
import { isEmpty } from '@/common/utils';

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
