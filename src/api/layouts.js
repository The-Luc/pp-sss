import layouts from '@/mock/layouts';

export const loadLayouts = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(layouts);
    });
  });
