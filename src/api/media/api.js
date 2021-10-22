import { graphqlRequest } from '../axios';

import { mediaMapping } from '@/common/mapping';

import {
  PictureAssetEntity,
  VideoAssetEntity
} from '@/common/models/entities/asset';

import { getMediaApi } from './queries';

export const getPhotos = async (id, terms = []) => {
  const res = await graphqlRequest(getMediaApi, { id, terms });

  return res.data?.search_community_assets
    ?.filter(asset => !asset.is_media)
    .map(asset => new PictureAssetEntity(mediaMapping(asset)));
};

export const getMedia = async (id, terms = []) => {
  const res = await graphqlRequest(getMediaApi, { id, terms });

  return res.data?.search_community_assets.map(asset => {
    return asset.is_media
      ? new VideoAssetEntity(mediaMapping(asset, !asset.is_media))
      : new PictureAssetEntity(mediaMapping(asset));
  });
};
