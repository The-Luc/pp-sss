import mockLayouts from '@/mock/layouts';
import { packageLayouts, supplementalLayouts } from '@/mock/digitalLayouts';

export const loadLayouts = () => {
  const storageLayouts =
    JSON.parse(window.sessionStorage.getItem('ppLayouts')) || [];
  const layouts = [...mockLayouts, ...storageLayouts];
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
