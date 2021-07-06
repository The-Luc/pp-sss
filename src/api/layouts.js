// import layouts from '@/mock/layouts';
import layouts from '@/mock/digitalLayouts';

export const loadLayouts = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(layouts);
    });
  });
