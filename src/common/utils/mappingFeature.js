import { intersection } from 'lodash';
import { DIGITAL_PAGE_SIZE, PROPERTIES_TOOLS } from '@/common/constants';
import {
  isEmpty,
  getPrintCanvasSize,
  isBackground,
  isCoverSheetChecker
} from '@/common/utils';
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

export const isLayoutMappingChecker = sheetConfig => {
  const { mappingType } = sheetConfig;

  return mappingType === MAPPING_TYPES.LAYOUT.value;
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

  const { mappingStatus } = sheetConfig;

  return (
    enableContentMapping && mappingStatus && isLayoutMappingChecker(sheetConfig)
  );
};

export const isSecondaryFormat = (projectConfig, isDigital) => {
  const { primaryMapping } = projectConfig;

  return isDigital
    ? PRIMARY_FORMAT_TYPES.PRINT.value === primaryMapping
    : PRIMARY_FORMAT_TYPES.DIGITAL.value === primaryMapping;
};

export const isPrimaryFormat = (projectConfig, isDigital) => {
  const { primaryMapping } = projectConfig;

  return isDigital
    ? PRIMARY_FORMAT_TYPES.DIGITAL.value === primaryMapping
    : PRIMARY_FORMAT_TYPES.PRINT.value === primaryMapping;
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

/**
 * Divide objects into 4 quadrants
 *   If inside front cover: object will be at q3, q4
 *   If inside back cover: object will be at q1, q2
 *
 * @param {Object} sheet sheet data
 * @param {Object} objects pp objects
 * @returns array of quadrants [q1, q2, q3, q4]
 */
export const divideObjectsIntoQuadrants = (sheet, objects) => {
  const { isHardCover, type } = sheet;
  const { sheetWidth, sheetHeight } = getPrintCanvasSize(type, isHardCover);

  const midX = sheetWidth / 2;
  const midY = sheetHeight / 2;

  const quadrants = [];

  objects.forEach(o => {
    if (!o.coord || isBackground(o)) return;

    const { x, y } = o.coord;

    /*
    Quadrant index
    -----------
       0 |  2
    -----------
       1 |  3 
    */
    const set1 = x > midX ? [2, 3] : [0, 1];
    const set2 = y > midY ? [1, 3] : [0, 2];

    const [index] = intersection(set1, set2);

    if (!Array.isArray(quadrants[index])) quadrants[index] = [];

    // reset objects in quadrant 2, 3, 4 so that they are like objects in q1
    if (index === 1) o.coord.y = o.coord.y - midY;
    if (index === 2) o.coord.x = o.coord.x - midX;
    if (index === 3) {
      o.coord.x = o.coord.x - midX;
      o.coord.y = o.coord.y - midY;
    }

    quadrants[index].push(o);
  });

  return quadrants;
};

// modify object's positions and dimensions based on theirs quadrant
export const modifyQuadrantObjects = (sheet, objects) => {
  const { isHardCover, type } = sheet;
  const { sheetWidth, sheetHeight } = getPrintCanvasSize(type, isHardCover);

  const midX = sheetWidth / 2;
  const midY = sheetHeight / 2;

  const ratioX = DIGITAL_PAGE_SIZE.PDF_WIDTH / midX;
  const ratioY = DIGITAL_PAGE_SIZE.PDF_HEIGHT / midY;

  objects.forEach(o => {
    if (!o.coord || isBackground(o)) return;

    // update object dimensions
    o.size.width = o.size.width * 1.8;
    o.size.height = o.size.height * 1.8;

    // update object coordinate
    o.coord.x = o.coord.x * ratioX;
    o.coord.y = o.coord.y * ratioY;
  });
};

export const mappingQuadrantFrames = (quadrants, sheet, frameIds) => {
  const isCoverSheet = isCoverSheetChecker(sheet);

  if (isCoverSheet) {
    const coverOrders = [2, 3, 0, 1]; // front cover first then back cover
    return frameIds.map((frameId, idx) => ({
      frameId,
      objects: quadrants[coverOrders[idx]]
    }));
  }

  const notNullQuadrants = quadrants.filter(Boolean);
  return frameIds.map((frameId, idx) => ({
    frameId,
    objects: notNullQuadrants[idx] || []
  }));
};
