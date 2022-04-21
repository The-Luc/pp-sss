import {
  getPortraitFoldersApi,
  saveSelectedPortraitFolders
} from '@/api/portrait';

export const usePortrait = () => {
  return {
    getPortraitFolders: getPortraitFoldersApi,
    saveSelectedPortraitFolders
  };
};
