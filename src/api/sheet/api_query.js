import { OBJECT_TYPE, SHEET_TYPE } from '@/common/constants';
import {
  changeObjectsCoords,
  convertObjectPxToInch,
  entitiesToObjects,
  isOk
} from '@/common/utils';
import { get } from 'lodash';
import { graphqlRequest } from '../urql';
import {
  digitalWorkspaceQuery,
  pageInfoQuery,
  printWorkspaceQuery,
  sheetInfoQuery
} from './queries';

export const getPageDataApi = async id => {
  const res = await graphqlRequest(pageInfoQuery, { id });
  const page = res?.data?.page;

  if (!page) return;

  return {
    id: page.id,
    objects: page.layout.elements
  };
};

export const getSheetInfoApi = async id => {
  const response = await graphqlRequest(sheetInfoQuery, { id });

  const pages = get(response.data, 'sheet.pages', []);
  const bookId = get(response.data, 'sheet.book.id');
  const pageIds = pages.map(page => page.id);
  const sheetType = SHEET_TYPE[response.data.sheet.sheet_type];

  const pageObjects = (() => {
    const leftObjects = get(pages[0], 'layout.elements', []);
    const rightObjects = get(pages[1], 'layout.elements', []);

    // convert unit from pixels to inch
    convertObjectPxToInch(leftObjects);
    convertObjectPxToInch(rightObjects);

    if (sheetType === SHEET_TYPE.BACK_COVER) return leftObjects;

    if (sheetType === SHEET_TYPE.FRONT_COVER) {
      return changeObjectsCoords(leftObjects, 'right');
    }

    return [...leftObjects, ...changeObjectsCoords(rightObjects, 'right')];
  })();

  const objects = pageObjects.sort((a, b) => {
    const isABackground = a.type === OBJECT_TYPE.BACKGROUND;
    const isBBackground = b.type === OBJECT_TYPE.BACKGROUND;

    if (isABackground || isBBackground) {
      return Number(isBBackground) - Number(isABackground);
    }
    return a?.arrangeOrder - b?.arrangeOrder;
  });

  let pageRight = pages[1];

  if (sheetType === SHEET_TYPE.FRONT_COVER) pageRight = pages[0];

  const leftName = get(pages[0], 'page_number');
  const rightName = get(pageRight, 'page_number');
  const pageNumber = {
    pageLeftName: String(leftName).padStart(2, '0'),
    pageRightName: String(rightName).padStart(2, '0')
  };

  const isLeftNumberOn = get(pages[0], 'show_page_number');
  const isRightNumberOn = get(pageRight, 'show_page_number');
  const spreadInfo = {
    isLeftNumberOn,
    isRightNumberOn
  };

  return {
    objects: entitiesToObjects(objects),
    sheetType,
    pageNumber,
    spreadInfo,
    pageIds,
    bookId
  };
};

export const getWorkspaceApi = async (sheetId, isDigital) => {
  const query = isDigital ? digitalWorkspaceQuery : printWorkspaceQuery;

  const res = await graphqlRequest(query, { id: sheetId });

  if (!isOk(res)) return [];

  if (isDigital) {
    return get(res.data, 'sheet.digital_workspace.digital_assets', []);
  }

  return get(res.data, 'sheet.workspace.assets', []);
};
