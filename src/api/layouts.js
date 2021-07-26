import { MODIFICATION } from '@/common/constants';
import { modifyItems } from '@/common/utils';
import { packageLayouts, supplementalLayouts } from '@/mock/digitalLayouts';

export const loadLayouts = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(window.data.layouts);
    });
  });
};

export const loadDigitalLayouts = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(packageLayouts);
    });
  });

export const loadSupplementalLayouts = () =>
  Promise.resolve(supplementalLayouts);

export const loadPrintPpLayouts = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(window.data.layouts);
    });
  });
};

export const setPrintPpLayouts = layout => {
  setTimeout(() => {
    window.data.savedLayouts.push(layout);
  });
};

export const getPrintLayoutTypes = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(window.data.layoutTypes);
    });
  });
};

export const saveToFavorites = layoutId => {
  return new Promise(resolve => {
    if (!layoutId) {
      resolve();

      return;
    }

    const index = window.data.favoritesLayouts.findIndex(f => f === layoutId);

    const modification = index < 0 ? MODIFICATION.ADD : MODIFICATION.DELETE;

    window.data.favoritesLayouts = modifyItems(
      window.data.favoritesLayouts,
      layoutId,
      index,
      modification
    );

    resolve();
  });
};

export const getFavorites = () => {
  return new Promise(resolve => {
    resolve(window.data.favoritesLayouts);
  });
};

export const getCustom = () => {
  return new Promise(resolve => {
    resolve(window.data.savedLayouts);
  });
};

export const getLayoutsByThemeAndType = (themeId, layoutTypeId) => {
  return new Promise(resolve => {
    const layouts = window.data.layouts.filter(
      l => l.themeId === themeId && l.type === layoutTypeId
    );

    resolve(layouts);
  });
};

export const getCustomAndFavoriteLayouts = pageType => {
  return new Promise(resolve => {
    const favorites = window.data.layouts.filter(l =>
      window.data.favoritesLayouts.includes(l.id)
    );

    const layouts = [...window.data.savedLayouts, ...favorites].filter(
      l => l.pageType === pageType
    );

    resolve(layouts);
  });
};
