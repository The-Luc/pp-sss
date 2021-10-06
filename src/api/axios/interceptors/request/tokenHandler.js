import { LOCAL_STORAGE } from '../../../../common/constants';
import { getItem } from '../../../../common/storage';

const tokenHandler = config => {
  const token = getItem(LOCAL_STORAGE.TOKEN);
  let Authorization;
  if (token) Authorization = `Bearer ${token}`;

  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization
    }
  };
};

export default tokenHandler;
