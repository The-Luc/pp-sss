import { portraitFolders } from '@/mock/portraitFolders';

export const getPortraitFolders = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(portraitFolders);
    });
  });
};
