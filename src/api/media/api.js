import { graphqlRequest } from '../urql';
import { get } from 'lodash';
import { isEmpty, isOk } from '@/common/utils';
import { getAllAlbumsQuery, getMediaApi } from './queries';
import {
  extractAlbumCategories,
  mediaMapping,
  parseAPIAlbums
} from '@/common/mapping';

import {
  PictureAssetEntity,
  VideoAssetEntity
} from '@/common/models/entities/asset';

export const getPhotos = async (id, terms = []) => {
  if (isEmpty(terms)) return [];

  const res = await graphqlRequest(getMediaApi, { id, terms });

  return res.data?.search_community_assets
    ?.filter(asset => !asset.is_media)
    .map(asset => new PictureAssetEntity(mediaMapping(asset)));
};

export const getMedia = async (id, terms = []) => {
  if (isEmpty(terms)) return [];

  const res = await graphqlRequest(getMediaApi, { id, terms });

  return res.data?.search_community_assets.map(asset => {
    return asset.is_media
      ? new VideoAssetEntity(mediaMapping(asset, !asset.is_media))
      : new PictureAssetEntity(mediaMapping(asset));
  });
};

export const getAlbumsAndCategories = async (communityId, mediaType) => {
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
