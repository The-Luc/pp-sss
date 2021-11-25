import { OBJECT_TYPE } from '@/common/constants';
import {
  changeObjectsCoords,
  entitiesToObjects,
  isEmpty
} from '@/common/utils';
import { get } from 'lodash';
import { getAssetByIdApi } from '../media';
import { graphqlRequest } from '../urql';
import { pageInfoQuery, sheetInfoQuery } from './queries';

export const getPageDataApi = async id => {
  const res = await graphqlRequest(pageInfoQuery, { id });
  return res?.data;
};

export const getSheetInfoApi = async id => {
  const response = await graphqlRequest(sheetInfoQuery, { id });

  const pages = get(response.data, 'sheet.pages', []);

  const pageObjects = pages.map((page, idx) => {
    const elements = get(page, 'layout.elements', []);
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

  return { objects: entitiesToObjects(objects), media };
};
