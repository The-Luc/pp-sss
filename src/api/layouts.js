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
    window.data.layouts = [...window.data.layouts, layout];
  });
};

export const getPrintLayoutTypes = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(window.data.layoutTypes);
    });
  });
};

export const saveToFavorites = (layoutId, isFavorites) => {
  return new Promise(resolve => {
    if (!layoutId) {
      resolve();

      return;
    }

    const index = window.data.layouts.findIndex(({ id }) => id === layoutId);

    if (index < 0) {
      resolve();

      return;
    }

    window.data.layouts[index] = { ...window.data.layouts[index], isFavorites };

    resolve();
  });
};

export const getFavorites = () => {
  return new Promise(resolve => {
    const favorites = window.data.layouts.filter(
      ({ isFavorites }) => isFavorites
    );

    resolve(favorites);
  });
};
