import { SYSTEM_OBJECT_TYPE } from '@/common/constants';
import {
  BackgroundElementObject,
  ClipArtElementObject,
  ImageElementObject,
  TextElementObject
} from '@/common/models/element';
import { getPagePrintSize, pxToIn, pxToPt, isEmpty } from '@/common/utils';
import { first, get } from 'lodash';
import { graphqlRequest } from '../axios';
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

const createTextElement = (element, isRightPage) => {
  const id = get(element, 'properties.guid', '');
  const text = get(element, 'text.properties.text', '');
  const { font_size, text_aligment: alignment } = get(element, 'text.view', {});

  return new TextElementObject({
    ...getElementDimension(element, isRightPage),
    id,
    text,
    fontSize: pxToPt(font_size),
    alignment
  });
};

const createImageElement = (element, isRightPage) => {
  const id = get(element, 'properties.guid', '');
  const { properties } = element?.picture || {};
  const imageUrl = properties?.url?.startsWith('http') ? properties?.url : '';

  return new ImageElementObject({
    ...getElementDimension(element, isRightPage),
    id,
    imageUrl
  });
};

const createClipartElement = (element, isRightPage) => {
  const { vector = '', guid: id } = element?.properties || {};

  return new ClipArtElementObject({
    ...getElementDimension(element, isRightPage),
    id,
    vector
  });
};

const createBackgroundElement = page => {
  const imageUrl = get(page, 'layout.view.background.image_url', '');

  return new BackgroundElementObject({
    imageUrl
  });
};

const getElementDimension = (element, isRightPage) => {
  const {
    size: { width, height },
    position: { top, left },
    opacity
  } = element?.view || {};

  const { pageWidth } = getPagePrintSize().inches;

  const size = {
    width: pxToIn(width),
    height: pxToIn(height)
  };

  const coord = {
    x: isRightPage ? pxToIn(left) + pageWidth : pxToIn(left),
    y: pxToIn(top)
  };

  return { size, coord, opacity };
};
