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
      primary_mapping_format: {
        name: 'primaryMapping'
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
 * To map API object to structure that can be use on the FE 
 
 * @param {Object} data sheet mapping data from API
 * return mapped object
 */
export const sheetMappingConfigMapping = data => {
  if (!data) return {};

  const mapRules = {
    data: {
      mapping_status: {
        name: 'mappingStatus',
        isForce: true
      },
      mapping_type: {
        name: 'mappingType'
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
      primaryMapping: {
        name: 'primary_mapping_format'
      },
      enableContentMapping: {
        name: 'enable_content_mapping'
      }
    },
    restrict: []
  };

  return mapObject(data, mapRules);
};

/**
 * To map FE object to structure that can be sent to server
 
 * @param {Object} data sheet mapping data
 * return mapped object
 */
export const sheetMappingConfigToApiMapping = data => {
  const mapRules = {
    data: {
      mappingStatus: {
        name: 'mapping_status',
        isForce: true
      },
      mappingType: {
        name: 'mapping_type'
      }
    },
    restrict: []
  };

  return mapObject(data, mapRules);
};

export const elementMappings = data => {
  const mapRules = {
    data: {
      print_element_uid: {
        name: 'printElementId',
        isForce: true
      },
      digital_element_uid: {
        name: 'digitalElementId',
        isForce: true
      }
    },
    restrict: []
  };

  return mapObject(data, mapRules);
};

export const elementMappingToApi = data => {
  const mapRules = {
    data: {
      printElementId: {
        name: 'print_element_uid',
        isForce: true
      },
      digitalElementId: {
        name: 'digital_element_uid',
        isForce: true
      }
    },
    restrict: []
  };

  return mapObject(data, mapRules);
};
