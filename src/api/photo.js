import { albums, photoList } from '@/mock/photo';
import { photoDropdowns } from '@/mock/photoDropdowns';

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

export const getPhotos = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(photoList);
    });
  });
};
