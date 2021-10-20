import { LOCAL_STORAGE } from '@/common/constants';
import { getItem } from '@/common/storage';

const tokenHandler = config => {
  const token = getItem(LOCAL_STORAGE.TOKEN);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

export default tokenHandler;
