import { changeObjectsCoords } from './layout';
import { getPagePrintSize } from './canvas';
import { isEmpty } from './util';

import { OBJECT_TYPE, SHEET_TYPE } from '@/common/constants';
import { sortByProperty } from '.';
import { FrameDetail, Transition } from '../models';
import { frameMapping } from '../mapping/frame';
import { transitionMapping } from '../mapping';
import { convertObjectInchToPx } from './objects';
import { cloneDeep } from 'lodash';

export const isHalfSheet = sheet => {
  return (
    !isEmpty(sheet) &&
    [SHEET_TYPE.FRONT_COVER, SHEET_TYPE.BACK_COVER].indexOf(sheet.type) >= 0
  );
};

export const isHalfLeft = sheet => {
  return !isEmpty(sheet) && sheet.type === SHEET_TYPE.BACK_COVER;
};

export const isHalfRight = sheet => {
  return !isEmpty(sheet) && sheet.type === SHEET_TYPE.FRONT_COVER;
};

export const isNormalSheet = sheet => {
  if (!sheet) return false;

  return sheet.type === SHEET_TYPE.NORMAL;
};

export const isCoverSheetChecker = sheet =>
  !isEmpty(sheet) && sheet.type === SHEET_TYPE.COVER;

/**
 * Format page number to name of page
 *
 * @param   {Number}  pageNumber  number of page
 * @returns {String}              name of page after format
 */
const formatPageNumber = pageNumber => {
  return `${pageNumber < 10 ? '0' : ''}${pageNumber}`;
};

/**
 * Get name of left page
 *
 * @param   {String}  type                    sheet type
 * @param   {Number}  sheetIndex              current sheet index in section
 * @param   {Number}  totalSheetUntilPrevious total sheet until previous section
 * @returns {String}                          name of left page
 */
export const getPageLeftName = (
  { type },
  sheetIndex,
  totalSheetUntilPrevious
) => {
  if (type === SHEET_TYPE.COVER) return 'Back Cover';

  if (type === SHEET_TYPE.FRONT_COVER) return 'Inside Front Cover';

  return formatPageNumber((totalSheetUntilPrevious + sheetIndex) * 2);
};

/**
 * Get name of right page
 *
 * @param   {String}  type                    sheet type
 * @param   {Number}  sheetIndex              current sheet index in section
 * @param   {Number}  totalSheetUntilPrevious total sheet until previous section
 * @returns {String}                          name of right page
 */
export const getPageRightName = (
  { type },
  sheetIndex,
  totalSheetUntilPrevious
) => {
  if (type === SHEET_TYPE.COVER) return 'Front Cover';

  if (type === SHEET_TYPE.FRONT_COVER) return formatPageNumber(1);

  if (type === SHEET_TYPE.BACK_COVER) return 'Inside Back Cover';

  return formatPageNumber((totalSheetUntilPrevious + sheetIndex) * 2 + 1);
};

/**
 * Get name of page
 *
 * @param   {Number}  sheetIndex              current sheet index in section
 * @param   {Number}  totalSheetUntilPrevious total sheet until previous section
 * @returns {String}                          name of page
 */
export const getPageName = (sheetIndex, totalSheetUntilPrevious) => {
  return formatPageNumber(totalSheetUntilPrevious + sheetIndex + 1);
};

/**
 *  To separate object into left page and right page
 *
 * @param {Object} sheet data of sheet
 * @returns leftLayout and rightLayout
 */
export const getPageLayouts = sheet => {
  const { leftLayout, rightLayout } = pageLayoutsFromSheet(sheet.objects);

  // if sheet type is inside-front-cover => move objects of the left page to right page
  if (isHalfRight(sheet.sheetProps)) {
    const { pageWidth, bleedLeft } = getPagePrintSize().inches;
    const halfSheet = pageWidth + bleedLeft;

    const leftElements = cloneDeep(leftLayout.elements);

    leftElements.forEach(o => (o.coord.x -= halfSheet));
    rightLayout.elements.push(...leftElements);
  }

  return { leftLayout, rightLayout };
};

/**
 * To seperate sheet into 2 pages
 *
 * @param {Object} sheet sheet data
 * @returns {Object} left and right page
 */
export const mapSheetToPages = sheet => {
  const {
    isLeftNumberOn,
    isRightNumberOn,
    leftTitle,
    rightTitle
  } = sheet.sheetProps.spreadInfo;

  const { leftLayout, rightLayout } = getPageLayouts(sheet);

  // convert inch to pixels to save to DB
  convertObjectInchToPx(leftLayout.elements);
  convertObjectInchToPx(rightLayout.elements);

  const leftPage = {
    layout: JSON.stringify(leftLayout),
    title: leftTitle,
    show_page_number: isLeftNumberOn
  };

  const rightPage = {
    layout: JSON.stringify(rightLayout),
    title: rightTitle,
    show_page_number: isRightNumberOn
  };

  return { leftPage, rightPage };
};

/**
 * To seperate objects and media of sheet into pages
 *
 * @param {Array} objects sheet objects
 * @returns {Object} {leftLayout, rightLayout} elements and workspace for each page
 */
export const pageLayoutsFromSheet = objects => {
  const { leftPageObjects, rightPageObjects } = seperateSheetObjectsIntoPages(
    objects
  );

  const leftLayout = {
    elements: leftPageObjects,
    workspace: []
  };

  const rightLayout = {
    elements: changeObjectsCoords(rightPageObjects, 'right', {
      moveToLeft: true
    }),
    workspace: []
  };
  return { leftLayout, rightLayout };
};

export const seperateSheetObjectsIntoPages = objects => {
  const leftPageObjects = [];
  const rightPageObjects = [];

  const { pageWidth, bleedLeft } = getPagePrintSize().inches;
  const halfSheet = pageWidth + bleedLeft;

  objects.forEach((o, index) => {
    if (o.type === OBJECT_TYPE.BACKGROUND) {
      o.isLeftPage ? leftPageObjects.push(o) : rightPageObjects.push(o);
      return;
    }

    o.arrangeOrder = index;
    o.coord.x < halfSheet ? leftPageObjects.push(o) : rightPageObjects.push(o);
  });

  return { leftPageObjects, rightPageObjects };
};

/**
 *  To get pageId based on page number
 *
 * @param {Number} pageNo number of the page will be applied portrait on
 * @returns {String}  pageId of the pageNo
 */
export const getPageIdFromPageNo = (pageNo, sheets) => {
  const sheet = Object.values(sheets).find(
    s => +s.pageLeftName === pageNo || +s.pageRightName === pageNo
  );

  if (!sheet) return null;

  if (isHalfSheet(sheet)) return sheet.pageIds[0];

  return +sheet.pageLeftName === pageNo ? sheet.pageIds[0] : sheet.pageIds[1];
};

/**
 * Get screen id based on screen number
 *
 * @param   {Number} screenNo number of the screen will be applied portrait on
 * @returns {Object}          screen info of the screenNo
 */
export const getScreenInfoFromScreenNo = (screenNo, sheets) => {
  const sheet = Object.values(sheets).find(s => +s.pageName === screenNo);

  return isEmpty(sheet) ? {} : { id: sheet.id, frameIds: sheet.frameIds };
};

/**
 * Get frame id based on frame number
 *
 * @param   {Number} frameNo  number of the frame will be applied portrait on
 * @returns {String}          frame id of the frameNo
 */
export const getFrameIdFromFrameNo = (frameNo, frameIds) => {
  return frameNo >= frameIds.length ? null : frameIds[frameNo - 1];
};

/**
 *  To get pageIds of sheet
 *
 * @param {Array} pageIds page ids of sheet
 * @param {Number} sheetType sheet type
 * @returns {Array} array of [leftpageId, rightPageId]
 */
export const getPageIdsOfSheet = (pageIds, sheetType) => {
  if (sheetType === SHEET_TYPE.BACK_COVER) return [pageIds[0], null];
  if (sheetType === SHEET_TYPE.FRONT_COVER) return [null, pageIds[0]];
  return pageIds;
};

/**
 * To convert API frames and transition to PP data
 *
 * @param {Object} sheet sheet object data
 * @returns {frames, transitions}
 */
export const handleMappingFrameAndTransition = sheet => {
  const frames = sheet.digital_frames;
  const sortedFrames = sortByProperty(frames, 'frame_order');

  const transitions = sheet.digital_transitions;
  const sortedTransitions = sortByProperty(transitions, 'transition_order');

  return {
    frames: sortedFrames.map(f => new FrameDetail(frameMapping(f))),
    transitions: sortedTransitions.map(
      t => new Transition(transitionMapping(t))
    )
  };
};
