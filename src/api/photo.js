import { mediaDropdowns, albums as myAlbums } from '@/mock/media';
import { albums } from '@/mock/photo';
import { uniqueId } from 'lodash';

export const getAlbums = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(albums);
    });
  });
};

export const getMediaCategories = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mediaDropdowns);
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

export const prepareUpload = async () => {
  return new Promise(resolve => {
    // will be removed soon, once we have the API
    setTimeout(() => resolve(), 1000);
  });
};

export const addMediaToAlbum = (albumId, mediaFiles, trackingProcessFn) => {
  let timeout = 0;
  const promises = mediaFiles.map(mf => {
    return new Promise(resolve => {
      // will be removed soon, once we have the API
      timeout += Math.round(Math.random() * 3 + 1, 0) * 500;

      setTimeout(() => {
        trackingProcessFn();

        resolve({ albumId, mf });
      }, timeout);
    });
  });

  return Promise.all(promises);
};

export const createNewAlbum = name => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ id: uniqueId(), name });
    });
  });
};
