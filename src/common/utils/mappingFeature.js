import { intersection } from 'lodash';
import {
  DIGITAL_PAGE_SIZE,
  PROPERTIES_TOOLS,
  PRIMARY_FORMAT_TYPES,
  CUSTOM_MAPPING_CONVERT_RATIO,
  CUSTOM_MAPPING_ICON_COLOR,
  MAPPING_TYPES
} from '@/common/constants';
import {
  isEmpty,
  getPrintCanvasSize,
  isBackground,
  isCoverSheetChecker,
  isHalfRight,
  isPpTextObject
} from '@/common/utils';

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

export const isCustomMappingChecker = sheetConfig => {
  const { mappingType } = sheetConfig;

  return mappingType === MAPPING_TYPES.CUSTOM.value;
};

/**
 *  Allowing sync data condition:
 * - MAPPING FUNCTIONALITY is on
 * - MAPPING STATUS is on
 * - MAPPING TYPE is LAYOUT
 *
 */
export const isAllowSyncLayoutData = (projectConfig, sheetConfig) => {
  const { enableContentMapping } = projectConfig;

  const { mappingStatus } = sheetConfig;

  return (
    enableContentMapping && mappingStatus && isLayoutMappingChecker(sheetConfig)
  );
};

/**
 *  Allowing sync data condition:
 * - MAPPING FUNCTIONALITY is on
 * - MAPPING STATUS is on
 * - MAPPING TYPE is CUSTOM
 *
 */
export const isAllowSyncCustomData = (projectConfig, sheetConfig) => {
  const { enableContentMapping } = projectConfig;

  const { mappingStatus } = sheetConfig;

  return (
    enableContentMapping && mappingStatus && isCustomMappingChecker(sheetConfig)
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
export const divideObjectsIntoQuadrants = (sheet, objects, isHardCover) => {
  const { type } = sheet;
  const { sheetWidth, sheetHeight } = getPrintCanvasSize(type, isHardCover);

  const midX = sheetWidth / 2;
  const midY = sheetHeight / 2;

  const quadrants = Array(4).fill(null);

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
export const modifyQuadrantObjects = (sheet, objects, isHardCover) => {
  const { type } = sheet;
  const { sheetWidth, sheetHeight } = getPrintCanvasSize(type, isHardCover);

  const midX = sheetWidth / 2;
  const midY = sheetHeight / 2;

  const ratioX = DIGITAL_PAGE_SIZE.PDF_WIDTH / midX;
  const ratioY = DIGITAL_PAGE_SIZE.PDF_HEIGHT / midY;

  const converter = value => Math.round(value * CUSTOM_MAPPING_CONVERT_RATIO);

  objects.forEach(o => {
    if (!o.coord || isBackground(o)) return;

    // update object dimensions
    o.size.width = converter(o.size.width * 100) / 100; // to get 2 decimals
    o.size.height = converter(o.size.height * 100) / 100; // to get 2 decimals

    // update object coordinate
    o.coord.x = o.coord.x * ratioX;
    o.coord.y = o.coord.y * ratioY;

    // fix font properties
    if (isPpTextObject(o)) {
      o.fontSize = converter(o.fontSize);
      o.letterSpacing = converter(o.letterSpacing);
      o.lineSpacing = converter(o.lineSpacing);
    }
  });
};

export const modifyDigitalQuadrantObjects = (
  sheet,
  objects,
  qdIndex,
  isHardCover
) => {
  const { type } = sheet;
  const { sheetWidth, sheetHeight } = getPrintCanvasSize(type, isHardCover);

  const midX = sheetWidth / 2;
  const midY = sheetHeight / 2;

  const ratioX = DIGITAL_PAGE_SIZE.PDF_WIDTH / midX;
  const ratioY = DIGITAL_PAGE_SIZE.PDF_HEIGHT / midY;

  const sizeOptions = {
    0: { x: 0, y: 0 },
    1: { x: 0, y: midY },
    2: { x: midX, y: 0 },
    3: { x: midX, y: midY }
  };
  const size = sizeOptions[qdIndex];

  const converter = value => Math.round(value / CUSTOM_MAPPING_CONVERT_RATIO);

  objects.forEach(o => {
    if (!o.coord || isBackground(o)) return;

    // update object dimensions
    o.size.width = converter(o.size.width * 100) / 100; // to get 2 decimals
    o.size.height = converter(o.size.height * 100) / 100; // to get 2 decimals

    // update object coordinate
    o.coord.x = o.coord.x / ratioX + size.x;
    o.coord.y = o.coord.y / ratioY + size.y;

    // fix font properties
    if (isPpTextObject(o)) {
      o.fontSize = converter(o.fontSize);
      o.letterSpacing = converter(o.letterSpacing);
      o.lineSpacing = converter(o.lineSpacing);
    }
  });
};

/**
 * mapping frames id and quadrants
 * @return: [{objects: q1, frameId: 123}]
 */
export const mappingQuadrantFrames = (quadrants, sheet, frameIds) => {
  let order = [0, 1, 2, 3];
  // front cover first then back cover
  if (isCoverSheetChecker(sheet) || isHalfRight(sheet)) order = [2, 3, 0, 1];

  return frameIds.map((frameId, idx) => ({
    frameId,
    objects: quadrants[order[idx]] || []
  }));
};

/**
 * To adding broken objects back to synced data from print
 *
 * @param {Array} quadrants quadrant array [{objects: {}, frameId: 123}]
 * @param {Array} frames array of frame data
 */
export const keepBrokenObjectsOfFrames = (quadrants, frames) => {
  const objectIds = quadrants.map(q => q.objects.map(o => o.id)).flat();

  frames.forEach(f => {
    const quadrant = quadrants.find(q => q.frameId === f.id);

    if (quadrant === undefined) return;

    const frameObjects = f.objects;

    frameObjects.forEach((o, idx) => {
      if (!objectIds.includes(o.id)) {
        quadrant.objects.splice(idx, 0, o);
      }
    });
  });
};

/**
 * To remove element in array of objects if object id is in elementMappings
 *
 * @param {Array} objects array of objects
 * @param {Array} elementMappings array of element mapping
 */
export const deleteNonMappedObjects = (objects, elementMappings) => {
  elementMappings.forEach(el => {
    const index = objects.findIndex(o => o.id === el.printElementId);

    if (index < 0) return;
    objects.splice(index, 1);
  });
};

/**
 * get mapping info for custom mapping
 */
export const getBrokenCustomMapping = el => {
  return {
    color: CUSTOM_MAPPING_ICON_COLOR,
    id: el.id,
    mapped: false,
    isCustom: true
  };
};

/**
 * Caclculate quadrant index of a frame
 * @return possible value 0, 1, 2, 3
 */
export const calcQuadrantIndexOfFrame = (sheet, frames, frameId) => {
  const frameIds = frames
    .filter(f => f.fromLayout)
    .map(f => f.id)
    .sort((a, b) => Number(a) - Number(b));

  const isCoverSheet = isCoverSheetChecker(sheet);

  const index = frameIds.indexOf(frameId);

  if (isCoverSheet) {
    const coverOrders = [2, 3, 0, 1]; // front cover first then back cover
    return coverOrders[index];
  }

  if (isHalfRight(sheet)) {
    return [2, 3][index];
  }

  return index;
};

/**
 * SYNC DATA DIRECTION: printObjects <== fObjects
 * Replace objects in printObjects by objects in fObjects
 *
 * @param {Array} printObjects
 * @param {Array} fObjects
 */
export const copyObjectsFrameObjectsToPrint = (printObjects, fObjects) => {
  const pObjectIds = printObjects.map(o => o.id);

  fObjects.forEach((o, idx) => {
    if (isBackground(o)) return;

    if (!pObjectIds.includes(o.id)) {
      // find index of existing element
      const prvItemIndex =
        idx === 0
          ? -1
          : printObjects.findIndex(pOjb => pOjb.id === fObjects[idx - 1].id);

      // insert new object
      printObjects.splice(prvItemIndex + 1, 0, o);
      return;
    }

    // find index of existing element
    const index = printObjects.findIndex(pOjb => pOjb.id === o.id);

    // replace existing element by new element
    printObjects.splice(index, 1, o);
  });
};
