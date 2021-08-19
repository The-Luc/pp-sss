import {
  prepareUpload,
  addMediaToAlbum,
  createNewAlbum,
  getAlbums,
  getMyAlbums,
  getMediaDropdowns
} from '@/api/photo';

export const usePhoto = () => {
  return {
    prepareUpload,
    addMediaToAlbum,
    createNewAlbum,
    getAlbums,
    getMyAlbums,
    getMediaDropdowns
  };
};
