import { mapObject } from '../utils';

/**
 * To map API object to structure that can be use on the FE 
 
 * @param {Object} data project mapping data from API
 * return mapped object
 */
export const projectMapping = data => {
  if (!data) return {};

  const mapRules = {
    data: {
      mapping_type: {
        name: 'mappingType'
      },
      primary_mapping_format: {
        name: 'primaryMapping'
      },
      mapping_status: {
        name: 'mappingStatus'
      },
      enable_content_mapping: {
        name: 'enableContentMapping'
      }
    },
    restrict: []
  };

  return mapObject(data, mapRules);
};

/**
 * To map FE object to structure that can be sent to server
 
 * @param {Object} data project mapping data
 * return mapped object
 */
export const projectMappingToApi = data => {
  const mapRules = {
    data: {
      mappingType: {
        name: 'mapping_type'
      },
      primaryMapping: {
        name: 'primary_mapping_format'
      },
      mappingStatus: {
        name: 'mapping_status'
      },
      enableContentMapping: {
        name: 'enable_content_mapping'
      }
    },
    restrict: []
  };

  return mapObject(data, mapRules);
};
