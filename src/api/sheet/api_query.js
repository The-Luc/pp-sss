import { SYSTEM_OBJECT_TYPE } from '@/common/constants';
import {
  isEmpty,
  createTextElement,
  createImageElement,
  createClipartElement,
  createBackgroundElement
} from '@/common/utils';
import { first, get } from 'lodash';
import { graphqlRequest } from '../urql';
import { pageInfoQuery, sheetInfoQuery } from './queries';

export const getPageData = async id => {
  const res = await graphqlRequest(pageInfoQuery, { id });
  return res.data;
};

export const getSheetInfo = async id => {
  const response = await graphqlRequest(sheetInfoQuery, { id });

  const pages = get(response.data, 'sheet.pages', []);

  const pageObjects = pages.map(page => {
    const isRightPage = get(page, 'page_number', 0) % 2;
    const elements = get(page, 'layout.elements', []);
    return elements.map(ele => {
      const key = first(Object.keys(ele));
      const value = ele[key];

      if (key === SYSTEM_OBJECT_TYPE.TEXT) {
        return createTextElement(value, isRightPage);
      }

      if (key === SYSTEM_OBJECT_TYPE.IMAGE) {
        return createImageElement(value, isRightPage);
      }

      return createClipartElement(value, isRightPage);
    });
  });

  const backgrounds = pages
    .map(createBackgroundElement)
    .filter(bg => !isEmpty(bg.imageUrl));

  return [].concat(...pageObjects, ...backgrounds);
};
