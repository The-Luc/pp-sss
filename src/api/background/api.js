import { graphqlRequest } from '../urql';
import {
  backgroundCategoriesQuery,
  backgroundQuery,
  backgroundOfThemeQuery
} from './queries';
import { BACKGROUND_TYPE, BACKGROUND_PAGE_TYPE } from '@/common/constants';
import { BackgroundElementEntity as BackgroundElement } from '@/common/models/entities/elements';
import { mapObject, isEmpty } from '@/common/utils';

const apiBackgroundToModel = background => {
  const mapRules = {
    data: {
      image_url: {
        name: 'imageUrl'
      },
      page_type: {
        name: 'pageType',
        parse: value => {
          const pageType = BACKGROUND_PAGE_TYPE[value]?.id;

          return isEmpty(pageType) ? value : pageType;
        }
      }
    },
    restrict: []
  };

  return mapObject(background, mapRules);
};

const getBackgroundsOfTheme = async (
  backgroundTypeId,
  backgroundTypeSubId,
  backgroundPageTypeId
) => {
  const res = await graphqlRequest(backgroundQuery, {
    id: backgroundTypeSubId
  });
  const backgrounds = res.data.category.backgrounds.map(
    item =>
      new BackgroundElement({
        ...apiBackgroundToModel(item),
        categoryId: backgroundTypeSubId,
        backgroundType: backgroundTypeId
      })
  );
  return backgrounds.filter(
    item =>
      item.pageType ===
      (backgroundPageTypeId || BACKGROUND_PAGE_TYPE.GENERAL.id)
  );
};

const getBackgroundsOfCategory = async (
  backgroundTypeId,
  backgroundTypeSubId,
  backgroundPageTypeId
) => {
  const res = await graphqlRequest(backgroundOfThemeQuery, {
    id: backgroundTypeSubId
  });

  const backgrounds = [];
  res.data.theme.templates.forEach(t => {
    t.categories.forEach(c => {
      c.backgrounds.forEach(b => {
        const index = backgrounds.findIndex(item => item.id === b.id);
        if (index >= 0) return;
        backgrounds.push(b);
      });
    });
  });

  return backgrounds
    .map(
      item =>
        new BackgroundElement({
          ...apiBackgroundToModel(item),
          categoryId: backgroundTypeSubId,
          backgroundType: backgroundTypeId
        })
    )
    .filter(
      item =>
        item.pageType ===
        (backgroundPageTypeId || BACKGROUND_PAGE_TYPE.GENERAL.id)
    );
};
/**
 * Get background for print edition
 *
 * @returns {Object}  query result
 */
export const getBackgrounds = async (
  backgroundTypeId,
  backgroundTypeSubId,
  backgroundPageTypeId
) => {
  if (backgroundTypeId === BACKGROUND_TYPE.CATEGORY.id) {
    return getBackgroundsOfTheme(
      backgroundTypeId,
      backgroundTypeSubId,
      backgroundPageTypeId
    );
  }
  return getBackgroundsOfCategory(
    backgroundTypeId,
    backgroundTypeSubId,
    backgroundPageTypeId
  );
};
/**
 * Get background categories for print edition
 *
 * @returns {Object}  query result
 */
export const getBackgroundCategories = async () => {
  const res = await graphqlRequest(backgroundCategoriesQuery);
  return res.data.categories.map(c => ({
    ...c,
    value: c.id
  }));
};
