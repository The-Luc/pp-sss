import layouts from '@/mock/layouts';
import digitalLayouts from '@/mock/digitalLayouts';

export const loadLayouts = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(layouts);
    });
  });

export const loadDigitalLayouts = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(digitalLayouts);
    });
  });
