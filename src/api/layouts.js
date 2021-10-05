import { cloneDeep } from 'lodash';
import {
  insertItemsToArray,
  isHalfSheet,
  removeItemsFormArray
} from '@/common/utils';
import { LAYOUT_PAGE_TYPE } from '@/common/constants';
import { supplementalLayouts } from '@/mock/digitalLayouts';
import { SAVED_AND_FAVORITES } from '@/mock/layoutTypes';

export const loadLayouts = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(window.data.printLayouts);
    });
  });
};

export const loadDigitalLayouts = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(window.data.digitalLayouts);
    });
  });

export const loadSupplementalLayouts = () =>
  Promise.resolve(supplementalLayouts);

export const setPrintPpLayouts = layout => {
  setTimeout(() => {
    window.data.printSavedLayouts.push(layout);
  });
};

export const getPrintLayoutTypes = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(window.data.printLayoutTypes);
    });
  });
};

export const getDigitalLayoutTypes = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(window.data.digitalLayoutTypes);
    });
  });
};

export const saveToFavorites = layoutId => {
  return new Promise(resolve => {
    if (!layoutId) {
      resolve();

      return;
    }

    const index = window.data.printFavoritesLayouts.findIndex(
      f => f === layoutId
    );

    if (index < 0) {
      window.data.printFavoritesLayouts = insertItemsToArray(
        window.data.printFavoritesLayouts,
        [{ value: layoutId }]
      );
    } else {
      window.data.printFavoritesLayouts = removeItemsFormArray(
        window.data.printFavoritesLayouts,
        [{ value: layoutId, index }]
      );
    }

    resolve();
  });
};

export const getFavorites = () => {
  return new Promise(resolve => {
    resolve(window.data.printFavoritesLayouts);
  });
};

export const getCustom = () => {
  return new Promise(resolve => {
    resolve(window.data.printSavedLayouts);
  });
};

export const getLayoutsByThemeAndType = (themeId, layoutTypeId) => {
  return new Promise(resolve => {
    const layouts = window.data.printLayouts.filter(
      l => l.themeId === themeId && l.type === layoutTypeId
    );

    resolve(layouts);
  });
};

export const getCustomAndFavoriteLayouts = pageType => {
  return new Promise(resolve => {
    const favorites = window.data.printLayouts.filter(l =>
      window.data.printFavoritesLayouts.includes(l.id)
    );

    const layouts = [...window.data.printSavedLayouts, ...favorites].filter(
      l => l.pageType === pageType
    );

    resolve(layouts);
  });
};

export const getFavoriteLayoutTypeMenu = sheetType => {
  return new Promise(resolve => {
    const favorites = window.data.printLayouts.filter(l =>
      window.data.printFavoritesLayouts.includes(l.id)
    );

    const layouts = [...window.data.printSavedLayouts, ...favorites];

    const isFullExisted = layouts.some(
      l => l.pageType === LAYOUT_PAGE_TYPE.FULL_PAGE.id
    );

    const isSingleExisted = layouts.some(
      l => l.pageType === LAYOUT_PAGE_TYPE.SINGLE_PAGE.id
    );

    const isFullEnable = !isHalfSheet({ type: sheetType }) && isFullExisted;

    const menu = cloneDeep(SAVED_AND_FAVORITES);

    menu.subItems.forEach(item => {
      if (item.id === LAYOUT_PAGE_TYPE.FULL_PAGE.id) {
        item.isDisabled = !isFullEnable;
      }
      if (item.id === LAYOUT_PAGE_TYPE.SINGLE_PAGE.id) {
        item.isDisabled = !isSingleExisted;
      }
    });

    resolve(menu);
  });
};
