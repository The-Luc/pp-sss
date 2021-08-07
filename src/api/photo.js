import { albums } from '@/mock/photo';
import { photoDropdowns, albums as myAlbums } from '@/mock/photoDropdowns';

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

export const getMyAlbums = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(myAlbums);
    });
  });
};
