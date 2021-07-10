import layouts from '@/mock/layouts';
import { packageLayouts, supplementalLayouts } from '@/mock/digitalLayouts';

export const loadLayouts = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(layouts);
    });
  });

export const loadDigitalLayouts = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(packageLayouts);
    });
  });

export const loadSupplementalLayouts = () =>
  Promise.resolve(supplementalLayouts);
