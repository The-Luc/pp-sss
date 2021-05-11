import api from '@/api/axios';
import { ENDPOINT } from '@/common/constants';

const albumService = {
  getAlbum: () => api.get(ENDPOINT.GET_BOOK),
  updateAlbum: data => {
    // api.put(`${ENDPOINT.GET_BOOK}/${data.albumId}`, data);
    return {
      status: 200,
      data: 'ok'
    };
  }
};

export default albumService;
