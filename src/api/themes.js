import themes from '@/mock/themes';
import digitalThemes from '@/mock/digitalThemes';
export const loadPrintThemes = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(themes);
    });
  });

export const loadDigitalThemes = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(digitalThemes);
    });
  });
