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

export const searchClipArtApi = async input => {
  const isNoneClipArt = input.toLowerCase() === 'no' || isEmpty(input);
  const clipArt = isNoneClipArt
    ? []
    : mockClipArts.sort(() => 0.5 - Math.random());

  return Promise.resolve(clipArt);
};
