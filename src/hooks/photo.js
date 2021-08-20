import {
  prepareUpload,
  addMediaToAlbum,
  createNewAlbum,
  getAlbums,
  getMyAlbums,
  getMediaCategories
} from '@/api/photo';

export const usePhoto = () => {
  return {
    prepareUpload,
    addMediaToAlbum,
    createNewAlbum,
    getAlbums,
    getMyAlbums,
    getMediaCategories
  };
};
