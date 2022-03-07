import {
  prepareUpload,
  addMediaToAlbum,
  createNewAlbum,
  getAlbums,
  getMyAlbums,
  getMediaCategories
} from '@/api/photo';

export const usePhioto = () => {
  return {
    prepareUpload,
    addMediaToAlbum,
    createNewAlbum,
    getAlbums,
    getMyAlbums,
    getMediaCategories
  };
};
