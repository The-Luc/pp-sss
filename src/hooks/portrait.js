import { getPortraitFolders } from '@/api/portrait/api';
import { saveSelectedPortraitFolders } from '@/api/portrait';

export const usePortrait = () => {
  return {
    getPortraitFolders,
    saveSelectedPortraitFolders
  };
};
