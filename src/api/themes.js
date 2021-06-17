import themes from '@/mock/themes';

export const loadPrintThemes = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(themes);
    });
  });
