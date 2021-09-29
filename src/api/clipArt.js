import mockClipArts, { CLIP_ART_CATEGORIES } from '@/mock/clipArt';
import { isEmpty } from '@/common/utils';

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

export const searchClipArt = async input => {
  const hasNo = input.toLowerCase() === 'no';
  const clipArt =
    hasNo || isEmpty(input) ? [] : mockClipArts.sort(() => 0.5 - Math.random());
  return Promise.resolve(clipArt);
};
