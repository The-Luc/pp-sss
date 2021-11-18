import { insertItemsToArray, removeItemsFormArray } from '@/common/utils';
import { supplementalLayouts } from '@/mock/digitalLayouts';

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
