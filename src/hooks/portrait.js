import {
  getPortraitFolders,
  saveSelectedPortraitFolders
} from '@/api/portrait';

export const usePortrait = () => {
  return {
    getPortraitFolders,
    saveSelectedPortraitFolders
  };
};
