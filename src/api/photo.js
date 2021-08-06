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
  const listKeywordValues = keywords.reduce((arr, keyword) => {
    if (keyword.toLowerCase() !== 'no') {
      arr.push(keyword);
    }
    return arr;
  }, []);
  const response = isEmpty(listKeywordValues) ? [] : photoList;

  return Promise.resolve(response);
};
