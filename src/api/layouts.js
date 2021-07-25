import mockPrintLayouts from '@/mock/layouts';
import { LAYOUT_TYPES as mockPrintLayoutTypes } from '@/mock/layoutTypes';
import { packageLayouts, supplementalLayouts } from '@/mock/digitalLayouts';

export const loadLayouts = () => {
  const storageLayouts =
    JSON.parse(window.sessionStorage.getItem('ppLayouts')) || [];
  const layouts = [...mockPrintLayouts, ...storageLayouts];

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(layouts);
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
  const storageLayouts =
    JSON.parse(window.sessionStorage.getItem('ppLayouts')) || [];

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(storageLayouts);
    });
  });
};

export const setPrintPpLayouts = layouts => {
  setTimeout(() => {
    window.sessionStorage.setItem('ppLayouts', JSON.stringify(layouts));
  });
};

export const getPrintLayoutTypes = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockPrintLayoutTypes);
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
