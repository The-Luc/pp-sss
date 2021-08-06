import { albums, photoList } from '@/mock/photo';
import { photoDropdowns } from '@/mock/photoDropdowns';
import { isEmpty } from '@/common/utils';

export const getAlbums = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(albums);
    });
  });
};

export const getPhotoDropdowns = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(photoDropdowns);
    });
  });
};

export const getPhotos = async (keywords = []) => {
  const hasNo = keywords.find(keyword => keyword.toLowerCase() === 'no');

  return Promise.resolve(hasNo || isEmpty(keywords) ? [] : photoList);
};
