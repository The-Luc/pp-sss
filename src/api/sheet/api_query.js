import { OBJECT_TYPE, SHEET_TYPE } from '@/common/constants';
import { changeObjectsCoords, entitiesToObjects, isOk } from '@/common/utils';
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

  const pageObjects = pages.map((page, idx) => {
    const elements = get(page, 'layout.elements', []);

    if (sheetType === SHEET_TYPE.BACK_COVER) return elements;
    if (sheetType === SHEET_TYPE.FRONT_COVER) {
      const leftObjects = elements.filter(e => e.isLeftPageObject);
      const rightObjects = elements.filter(e => !e.isLeftPageObject);

      return [...leftObjects, ...changeObjectsCoords(rightObjects, 'right')];
    }

    return idx === 0 ? elements : changeObjectsCoords(elements, 'right');
  });

  const objects = pageObjects.flat().sort((a, b) => {
    const isABackground = a.type === OBJECT_TYPE.BACKGROUND;
    const isBBackground = b.type === OBJECT_TYPE.BACKGROUND;

    if (isABackground || isBBackground) {
      return Number(isBBackground) - Number(isABackground);
    }
    return a?.arrangeOrder - b?.arrangeOrder;
  });

  return { objects: entitiesToObjects(objects), meida: null, sheetType };
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
