import { changeObjectsCoords, isEmpty } from '@/common/utils';
import { get } from 'lodash';
import { getAssetById } from '../media';
import { graphqlRequest } from '../urql';
import { pageInfoQuery, sheetInfoQuery } from './queries';

export const getPageData = async id => {
  const res = await graphqlRequest(pageInfoQuery, { id });
  return res.data;
};

export const getSheetInfo = async id => {
  const response = await graphqlRequest(sheetInfoQuery, { id });

  const pages = get(response.data, 'sheet.pages', []);

  const pageObjects = pages.map((page, idx) => {
    const elements = get(page, 'layout.elements', []);
    return idx === 0 ? elements : changeObjectsCoords(elements, 'right');
  });

  const assetIds = pages.reduce(
    (acc, { layout }) =>
      isEmpty(layout.workspace) ? acc : acc.concat(layout.workspace),
    []
  );

  const mediaPromises = assetIds.map(id => getAssetById(id));
  const media = await Promise.all(mediaPromises);

  return { objects: pageObjects.flat(), media };
};
