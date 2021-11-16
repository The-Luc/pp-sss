import { graphqlRequest } from '../urql';
import { get } from 'lodash';
import { isEmpty, isOk } from '@/common/utils';
import { getAllAlbumsQuery, getAssetByIdQuery, getMediaQuery } from './queries';
import {
  extractAlbumCategories,
  mediaMapping,
  parseAPIAlbums
} from '@/common/mapping';

import {
  PictureAssetEntity,
  VideoAssetEntity
} from '@/common/models/entities/asset';
import { ASSET_TYPE } from '@/common/constants';

export const getPhotosApi = async (id, terms = []) => {
  if (isEmpty(terms)) return [];

  const res = await graphqlRequest(getMediaQuery, { id, terms });

  if (!isOk(res)) return [];

  return res.data.search_community_assets
    ?.filter(asset => !asset.is_media)
    .map(asset => new PictureAssetEntity(mediaMapping(asset)));
};

export const getMediaApi = async (id, terms = []) => {
  if (isEmpty(terms)) return [];

  const res = await graphqlRequest(getMediaQuery, { id, terms });

  if (!isOk(res)) return [];

  return res.data.search_community_assets.map(asset => {
    return asset.is_media
      ? new VideoAssetEntity(mediaMapping(asset, !asset.is_media))
      : new PictureAssetEntity(mediaMapping(asset));
  });
};

/**
 * To fetch data of a asset by its id
 *
 * @param {String} assetId asset id
 * @returns {Object} asset data
 */
export const getAssetByIdApi = async assetId => {
  const res = await graphqlRequest(getAssetByIdQuery, { id: assetId });

  if (!isOk(res)) return;

  const asset = await mediaMapping(res.data.asset);
  asset.type = asset.isMedia ? ASSET_TYPE.VIDEO : ASSET_TYPE.PICTURE;

  return asset;
};

export const getAlbumsAndCategoriesApi = async (communityId, mediaType) => {
  const res = await graphqlRequest(getAllAlbumsQuery, {
    communityId,
    mediaType
  });

  if (!isOk(res)) return;

  const communities = get(res, 'data.community_containers', []);
  const groups = get(res, 'data.community_group_assets', []);
  const personalAlbums = get(res, 'data.user_containers', []);

  // mapping list of categories
  const albumCategories = {
    communities: extractAlbumCategories(communities),
    groups: extractAlbumCategories(groups),
    personalAlbums: extractAlbumCategories(personalAlbums)
  };

  // normalize albums
  const albums = {
    communities: parseAPIAlbums(communities),
    groups: parseAPIAlbums(groups),
    personalAlbums: parseAPIAlbums(personalAlbums)
  };

  return { albumCategories, albums };
};
