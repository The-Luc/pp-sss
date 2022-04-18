import { cloneDeep, get } from 'lodash';
import { activeCanvasInfo, pxToIn } from './canvas';
import {
  CUSTOM_LAYOUT_TYPE,
  DATABASE_DPI,
  LAYOUT_PAGE_TYPE,
  OBJECT_TYPE,
  PRINT_PAGE_SIZE,
  SHEET_TYPE
} from '../constants';
import { isEmpty } from './util';
import {
  BackgroundElementObject,
  ClipArtElementObject,
  ImageElementObject,
  TextElementObject
} from '../models/element';
import {
  convertAPIColorObjectToHex,
  getUniqueId,
  parseFromAPIShadow,
  pxToPt
} from '.';
import { apiTextToModel } from '../mapping';
import { BACKGROUND_PAGE_TYPE } from '@/common/constants';

export const isSingleLayout = layout =>
  !isEmpty(layout) && layout?.pageType === LAYOUT_PAGE_TYPE.SINGLE_PAGE.id;

export const isFullLayout = layout =>
  !isEmpty(layout) && layout?.pageType === LAYOUT_PAGE_TYPE.FULL_PAGE.id;

export const isCoverLayoutChecker = layout =>
  !isEmpty(layout) && layout?.type === 'COVER';

/**
 * Get layout option from list layouts option by id
 *
 * @param   {Array} listLayouts - List layouts. It include themeId, layout type
 * @param   {Array} listLayoutType - List layout option of select
 * @param   {Number} layoutId - Layout id of sheet
 * @returns {Object} Object layout option
 */
export const getLayoutOptSelectedById = (
  listLayouts,
  listLayoutType,
  layoutId
) => {
  const layout = listLayouts.find(l => l.id === layoutId);

  const layoutType = listLayoutType.find(({ value }) => value === layout.type);

  if (!isEmpty(layoutType)) return layoutType;

  const layoutOpt = listLayoutType.find(l => l.value === CUSTOM_LAYOUT_TYPE);

  const indexSubItem =
    layout.pageType === LAYOUT_PAGE_TYPE.SINGLE_PAGE.id ? 0 : 1;

  return {
    value: layoutOpt.value,
    sub: layoutOpt.subItems[indexSubItem]
  };
};

/**
 *  To change objects coords to fit the side that use what to render them
 *
 * @param {Object} objects that will be change their coord to place in the right side (left/right)
 * @param {Number | String} position left or right || FRONT_COVER or BACK_COVER
 * @param {Object} options adding config for the function, available options: moveToLeft
 *  if moveToLeft is true, the right page objects will be move to left
 *
 * @returns objects have coords changed
 */
export const changeObjectsCoords = (objects, position, options) => {
  const isLeftPage = position === 'left' || position === SHEET_TYPE.BACK_COVER;

  const newObjects = cloneDeep(objects);

  if (isLeftPage) return newObjects;

  const { mid: midCanvas } = activeCanvasInfo();

  newObjects.forEach(object => {
    if (object.type === OBJECT_TYPE.BACKGROUND) return;

    object.coord.x +=
      options?.moveToLeft && !isLeftPage ? -midCanvas : midCanvas;
  });

  return newObjects;
};

export const createTextElement = element => {
  const props = apiTextToModel(element);

  return new TextElementObject({
    ...props,
    ...getElementDimension(element)
  });
};

export const createImageElement = element => {
  const id = get(element, 'properties.guid', '');
  const { properties } = element?.picture || {};
  const imageUrl = properties?.url?.startsWith('http') ? properties?.url : '';

  const imageProps = {};

  const opacity = element?.view?.opacity || 1;
  imageProps.opacity = opacity;

  // handle border
  const { color, style, width } = element.view.border;
  if (width !== 0) {
    const border = {
      showBorder: true,
      stroke: convertAPIColorObjectToHex(color),
      strokeWidth: pxToPt(width, DATABASE_DPI),
      strokeDashArray: [],
      strokeLineType: style
    };
    imageProps.border = border;
  }

  // handle shadow
  const boxShadow = element.view?.box_shadow || {};

  if (!isEmpty(boxShadow)) {
    const shadow = parseFromAPIShadow(boxShadow[0]);
    imageProps.shadow = shadow;
  }

  return new ImageElementObject({
    ...getElementDimension(element),
    id,
    imageUrl,
    ...imageProps
  });
};

export const createClipartElement = element => {
  const { large = '', guid: id } = element?.properties || {};

  return new ClipArtElementObject({
    ...getElementDimension(element),
    id,
    imageUrl: large
  });
};

export const createBackgroundElement = page => {
  const imageUrl = get(page, 'layout.view.background.image_url', '');
  const viewWidth = get(page, 'layout.view.size.width');
  const backgroundWidthTheshold = 4000; // max page width = 3000px, full spread width: 6000px
  const isFullBackground = viewWidth > backgroundWidthTheshold;
  const pageType = isFullBackground
    ? BACKGROUND_PAGE_TYPE.DOUBLE_PAGE.id
    : BACKGROUND_PAGE_TYPE.SINGLE_PAGE.id;

  return new BackgroundElementObject({
    id: getUniqueId(),
    imageUrl,
    pageType
  });
};

const getElementDimension = element => {
  const {
    size: { width, height },
    position: { top, left },
    opacity,
    rotation
  } = element?.view || {};

  const size = {
    width: pxToIn(width, DATABASE_DPI),
    height: pxToIn(height, DATABASE_DPI)
  };

  const isRightPage = left > PRINT_PAGE_SIZE.PDF_WIDTH * DATABASE_DPI;
  const bleedSize = isRightPage ? PRINT_PAGE_SIZE.BLEED : 0;

  const coord = {
    x: pxToIn(left, DATABASE_DPI) - bleedSize,
    y: pxToIn(top, DATABASE_DPI),
    rotation
  };

  if (rotation !== 0) {
    const { rx, ry } = getRotatedPoint(
      coord.x,
      coord.y,
      size.width,
      size.height,
      rotation
    );

    coord.x = rx;
    coord.y = ry;
  }

  return { size, coord, opacity };
};

export const getLayoutSelected = (sheet, layoutTypes = []) => {
  const index = layoutTypes.findIndex(l => l.sheetType === sheet.type);
  return layoutTypes[index];
};

export const getRotatedPoint = (x, y, width, height, rotation) => {
  const angle = (rotation * Math.PI) / 180;

  // get the center of the rectangle (==rotation point)
  const cx = x + width / 2;
  const cy = y + height / 2;

  // calc the angle of the unrotated TL corner vs the center point
  const dx = x - cx;
  const dy = y - cy;
  const originalTopLeftAngle = Math.atan2(dy, dx);

  // Add the unrotatedTL + rotationAngle to get total rotation
  const rotatedTopLeftAngle = originalTopLeftAngle + angle;

  // calc the radius of the rectangle (==diagonalLength/2)
  const radius = Math.sqrt(width * width + height * height) / 2;

  // calc the rotated top & left corner
  const rx = cx + radius * Math.cos(rotatedTopLeftAngle);
  const ry = cy + radius * Math.sin(rotatedTopLeftAngle);

  return { rx, ry };
};
