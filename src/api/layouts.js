import layouts from '@/mock/layouts';
import { packageLayouts, supplementalLayouts } from '@/mock/digitalLayouts';

export const loadLayouts = () => {
  let ppLayouts = JSON.parse(window.sessionStorage.getItem('ppLayouts')) || [];
  ppLayouts = [...layouts, ...ppLayouts];
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(ppLayouts);
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
  let ppLayouts = JSON.parse(window.sessionStorage.getItem('ppLayouts')) || [];
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(ppLayouts);
    });
  });
};

export const setPrintPpLayouts = layouts => {
  setTimeout(() => {
    window.sessionStorage.setItem('ppLayouts', JSON.stringify(layouts));
  });
};
