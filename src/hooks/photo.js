import {
  prepareUpload,
  addMediaToAlbum,
  createNewAlbum,
  getAlbums,
  getMyAlbums
} from '@/api/photo';

export const usePhoto = () => {
  return {
    prepareUpload,
    addMediaToAlbum,
    createNewAlbum,
    getAlbums,
    getMyAlbums
  };
};
