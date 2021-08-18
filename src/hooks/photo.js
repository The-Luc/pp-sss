import {
  prepareUpload,
  addMediaToAlbum,
  createNewAlbum,
  getAlbums,
  getMyAlbums,
  getPhotoDropdowns
} from '@/api/photo';

export const usePhoto = () => {
  return {
    prepareUpload,
    addMediaToAlbum,
    createNewAlbum,
    getAlbums,
    getMyAlbums,
    getPhotoDropdowns
  };
};
