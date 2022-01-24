import { OBJECT_TYPE, SHEET_TYPE } from '@/common/constants';
import {
  changeObjectsCoords,
  entitiesToObjects,
  isEmpty,
  isOk
} from '@/common/utils';
import { get } from 'lodash';
import { getAssetByIdApi } from '../media';
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
    if (sheetType === SHEET_TYPE.FRONT_COVER)
      return changeObjectsCoords(elements, 'right');

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

  const assetIds = pages.reduce(
    (acc, { layout }) =>
      isEmpty(layout.workspace) ? acc : acc.concat(layout.workspace),
    []
  );

  const mediaPromises = assetIds.map(id => getAssetByIdApi(id));
  const media = await Promise.all(mediaPromises);

  return { objects: entitiesToObjects(objects), media, sheetType };
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
