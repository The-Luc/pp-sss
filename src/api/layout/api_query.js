import { first, get, cloneDeep, findKey, uniqBy } from 'lodash';
import { SYSTEM_OBJECT_TYPE, LAYOUT_TYPES } from '@/common/constants';
import { graphqlRequest } from '../urql';
import {
  getAssortedLayoutQuery,
  getDigitalLayoutQuery,
  getDigitalTemplateByTypeQuery,
  getDigitalTemplateQuery,
  getLayoutElementsQuery,
  getLayoutsByTypeQuery,
  getLayoutsPreviewQuery,
  getLayoutsQuery,
  getUserDigitalLayoutsQuery,
  getUserLayoutsQuery
} from './queries';
import { LAYOUT_PAGE_TYPE } from '@/common/constants/layoutTypes';
import {
  convertObjectPxToInch,
  createBackgroundElement,
  createClipartElement,
  createImageElement,
  createTextElement,
  isOk,
  removeMediaContentWhenCreateThumbnail,
  isEmpty
} from '@/common/utils';

import { layoutElementMappings } from '@/common/mapping';

import { layoutMapping, digitalLayoutMapping } from '@/common/mapping/layout';

/**
 *  To get layout page types whether single or full page layout
 *
 * @param {Object} layout
 * @returns  layout page id
 */
const getPageType = layout =>
  layout.layout_type === 'DOUBLE_PAGE'
    ? LAYOUT_PAGE_TYPE.FULL_PAGE.id
    : LAYOUT_PAGE_TYPE.SINGLE_PAGE.id;

/**
 *  To get previewImageUrl of layouts of a theme
 * @param {String} themeId id of a theme
 * @returns array of object containing previewImageUrl of layouts
 */
export const getPrintLayoutsPreviewApi = async themeId => {
  if (!themeId) return [];

  const res = await graphqlRequest(getLayoutsPreviewQuery, { themeId });

  if (!isOk(res)) return [];

  const layoutImageUrls = get(res.data, 'theme.templates', []);

  return layoutImageUrls.map(l => ({ previewImageUrl: l.preview_image_url }));
};

/**
 * To get layout filtered by its themeId and its category
 * @param {String} themeId     id of a theme
 * @param {String} categoryId  id of a category
 * @returns array of layout object
 */
export const getLayoutsByThemeAndTypeApi = async (
  themeId,
  layoutTypeId,
  isIgnoreCache
) => {
  const res = await graphqlRequest(
    getLayoutsQuery,
    { themeId },
    false,
    isIgnoreCache
  );

  if (!isOk(res)) return [];
  const dbTemplates = get(res, 'data.theme.templates', []);

  const layoutType = findKey(LAYOUT_TYPES, o => o.value === layoutTypeId);

  const templates = dbTemplates.filter(
    t => t.layout_use === layoutType || (!t.layout_use && layoutType === 'MISC')
  );

  return templates.map(t => ({
    id: t.id,
    type: layoutType,
    themeId,
    previewImageUrl: t.preview_image_url,
    name: t.title,
    isFavorites: false,
    pageType: getPageType(t),
    mappings: layoutElementMappings(t)
  }));
};

/**
 * To get layout filtered by its themeId and its category
 * @param {String} themeId     id of a theme
 * @param {String} categoryId  id of a category
 * @returns array of layout object
 */
export const getPrintLayoutsByTypeApi = async (layoutTypeId, isIgnoreCache) => {
  const layoutType = findKey(LAYOUT_TYPES, o => o.value === layoutTypeId);

  if (!layoutType) return [];

  const res = await graphqlRequest(
    getLayoutsByTypeQuery,
    {
      layoutUse: layoutType
    },
    false,
    isIgnoreCache
  );

  if (!isOk(res)) return [];
  const dbThemes = get(res, 'data.themes', []);

  return dbThemes
    .map(theme =>
      theme.templates.map(t => ({
        id: t.id,
        type: layoutType,
        themeId: theme.id,
        previewImageUrl: t.preview_image_url,
        name: t.title,
        isFavorites: false,
        pageType: getPageType(t),
        mappings: layoutElementMappings(t)
      }))
    )
    .flat();
};

/** GET PRINT LAYOUT ELEMENTS */
export const getLayoutElementsApi = async id => {
  const res = await graphqlRequest(getLayoutElementsQuery, { id });

  if (!isOk(res)) return [];

  const elements = cloneDeep(get(res, 'data.template.layout.elements', []));

  if (elements[0]?.type) {
    // PP templates
    const objects = cloneDeep(elements);

    convertObjectPxToInch(objects);
    return objects;
  }

  // case: legacy templates
  const background = createBackgroundElement(get(res, 'data.template', {}));
  const elementsOrder = get(res, 'data.template.layout.elements_order');

  const elementData = elements.map(ele => {
    const key = first(Object.keys(ele));
    const value = ele[key];
    return {
      id: value.properties.guid,
      value,
      key
    };
  });

  const inOrderElements = elementsOrder
    .map(eleId => elementData.find(el => el.id === eleId))
    .reverse();

  return [
    background,
    ...inOrderElements.map(ele => {
      if (!ele) return;

      const { key, value } = ele;
      if (key === SYSTEM_OBJECT_TYPE.TEXT) {
        return createTextElement(value);
      }

      if (key === SYSTEM_OBJECT_TYPE.IMAGE) {
        return createImageElement(value);
      }

      return createClipartElement(value);
    })
  ].filter(Boolean);
};

/** GET ASSORTED LAYOUTS */
export const getAssortedLayoutsApi = async isIgnoreCache => {
  const res = await graphqlRequest(
    getAssortedLayoutQuery,
    {},
    false,
    isIgnoreCache
  );

  if (!isOk(res)) return;

  const { categories } = res.data;

  const assorted = categories
    .map(({ name, id, templates }) => ({
      name,
      id,
      templates: isEmpty(templates)
        ? []
        : uniqBy(templates.map(layoutMapping), 'id')
    }))
    .filter(c => !isEmpty(c.templates));

  return uniqBy(assorted, 'id');
};

/** GET CUSTOM PRINT LAYOUTS */
export const getCustomPrintLayoutApi = async isIgnoreCache => {
  const res = await graphqlRequest(
    getUserLayoutsQuery,
    {},
    false,
    isIgnoreCache
  );

  if (!isOk(res)) return;

  const { single_page, double_page } = res.data;

  return [...single_page, ...double_page].map(layoutMapping);
};

const removeMediaContent = layouts => {
  layouts.forEach(layout => {
    layout.frames.forEach(frame => {
      frame.objects = removeMediaContentWhenCreateThumbnail(frame.objects);
    });
  });
};

export const getCustomDigitalLayoutApi = async isIgnoreCache => {
  const res = await graphqlRequest(
    getUserDigitalLayoutsQuery,
    {},
    false,
    isIgnoreCache
  );

  if (!isOk(res)) return;

  const layouts = get(res, 'data.user_saved_digital_layouts');

  return layouts.map(l => digitalLayoutMapping(l));
};

/** GET DIGITAL LAYOUTS */
export const getDigitalLayoutsApi = async (themeId, isIgnoreCache) => {
  const res = await graphqlRequest(
    getDigitalTemplateQuery,
    { themeId },
    false,
    isIgnoreCache
  );

  if (!isOk(res)) return;

  const layouts = get(res, 'data.theme.digital_templates');

  return layouts.map(l => digitalLayoutMapping(l));
};

/** GET DIGITAL LAYOUTS BY LAYOUT TYPE - LOAD MORE */
export const getDigitalLayoutsByTypeApi = async (
  layoutTypeId,
  isIgnoreCache
) => {
  const layoutUse = findKey(LAYOUT_TYPES, o => o.value === layoutTypeId);

  if (!layoutUse) return [];

  const res = await graphqlRequest(
    getDigitalTemplateByTypeQuery,
    {
      layoutUse
    },
    false,
    isIgnoreCache
  );

  if (!isOk(res)) return [];

  const themes = get(res, 'data.themes', []);

  const layouts = themes
    .map(theme =>
      theme.digital_templates.map(tem => ({ ...tem, themeId: theme.id }))
    )
    .flat();

  return layouts.map(l => digitalLayoutMapping(l));
};

/** GET DIGITAL LAYOUT ELEMENTS */
export const getDigitalLayoutElementApi = async id => {
  const res = await graphqlRequest(getDigitalLayoutQuery, { id });

  if (!isOk(res)) return;

  const layout = get(res, 'data.digital_template');

  const mappedLayout = digitalLayoutMapping(layout);

  removeMediaContent([mappedLayout]);

  return mappedLayout;
};
