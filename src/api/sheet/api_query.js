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
  return res?.data;
};

export const getSheetInfoApi = async id => {
  const response = await graphqlRequest(sheetInfoQuery, { id });

  const pages = get(response.data, 'sheet.pages', []);
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

  return { objects: entitiesToObjects(objects), sheetType };
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
