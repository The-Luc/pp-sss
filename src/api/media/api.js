import { graphqlRequest } from '../axios';
import { mapObject } from '@/common/utils';
import { getMediaApi } from './queries';
import {
  PictureAssetEntity,
  VideoAssetEntity
} from '@/common/models/entities/asset';

const apiMediaToModel = (asset, isPhoto = true) => {
  const mediaUrl = isPhoto ? 'imageUrl' : 'mediaUrl';
  const mapRules = {
    data: {
      media_file_name: {
        name: 'mediaFileName'
      },
      thumbnail_uri: {
        name: 'thumbUrl'
      },
      media_url: {
        name: mediaUrl
      },
      original_height: {
        name: 'originalHeight'
      },
      original_width: {
        name: 'originalWidth'
      },
      is_media: {
        name: 'isMedia'
      }
    },
    restrict: []
  };

  return mapObject(asset, mapRules);
};

export const getPhotos = async (id, terms = []) => {
  const photos = await graphqlRequest(getMediaApi, { id, terms });

  return photos?.search_community_assets
    ?.filter(asset => !asset.is_media)
    .map(asset => new PictureAssetEntity(apiMediaToModel(asset)));
};

export const getMedia = async (id, terms = []) => {
  const media = await graphqlRequest(getMediaApi, { id, terms });

  return media?.search_community_assets.map(asset => {
    return asset.is_media
      ? new VideoAssetEntity(apiMediaToModel(asset, !asset.is_media))
      : new PictureAssetEntity(apiMediaToModel(asset));
  });
};
