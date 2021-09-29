import {
  getPortraitFolders,
  saveSelectedPortraitFolders,
  getSelectedPortraitFolders
} from '@/api/portrait';

export const usePortrait = () => {
  return {
    getPortraitFolders,
    saveSelectedPortraitFolders,
    getSelectedPortraitFolders
  };
};
