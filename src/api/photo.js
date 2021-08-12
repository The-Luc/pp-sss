import { photoDropdowns, albums as myAlbums } from '@/mock/photoDropdowns';
import { albums, photoList } from '@/mock/photo';
import { isEmpty } from '@/common/utils';
import { uniqueId } from 'lodash';

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

export const getPhotos = async (keywords = []) => {
  const hasNo = keywords.find(keyword => keyword.toLowerCase() === 'no');
  const photos =
    hasNo || isEmpty(keywords) ? [] : photoList.sort(() => 0.5 - Math.random());

  return Promise.resolve(photos);
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

export const searchPhotos = async input => {
  const hasNo = input.toLowerCase() === 'no';
  const photos =
    hasNo || isEmpty(input) ? [] : photoList.sort(() => 0.5 - Math.random());

  return Promise.resolve(photos);
};
