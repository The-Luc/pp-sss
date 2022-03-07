import {
  createAlbumAssetsMutation,
  updateAlbumAssetsMutation
} from './mutation';
import { graphqlRequest } from '../urql/index';
import { get } from 'lodash';
import { parseAPIAlbums } from '@/common/mapping';

export const updateAlbumAssetsApi = async (id, assets) => {
  const res = await graphqlRequest(
    updateAlbumAssetsMutation,
    {
      containerId: id,
      assets
    },
    true
  );

  const container = get(res, 'data.update_container_assets');

  return parseAPIAlbums([container])[0];
};

export const createAlbumAssetsApi = async params => {
  const res = await graphqlRequest(createAlbumAssetsMutation, { params }, true);
  const container = get(res, 'data.create_container');

  return parseAPIAlbums([container])[0];
};
