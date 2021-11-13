import { getPortraitFolders } from '@/api/portrait';
import { saveSelectedPortraitFolders } from '@/api/portraitService';

export const usePortrait = () => {
  return {
    getPortraitFolders,
    saveSelectedPortraitFolders
  };
};
