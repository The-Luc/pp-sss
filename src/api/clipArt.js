import mockClipArts, { CLIP_ART_CATEGORIES } from '@/mock/clipArt';

export const loadClipArts = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(mockClipArts);
    });
  });

export const loadClipArtCategories = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(CLIP_ART_CATEGORIES);
    });
  });
