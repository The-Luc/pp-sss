import { graphqlRequest } from '../urql';
import { get } from 'lodash';
import { isEmpty, isOk } from '@/common/utils';
import {
  getAllAlbumsQuery,
  getAssetByIdQuery,
  getInProjectAssetsQuery,
  getMediaQuery
} from './queries';
import {
  extractAlbumCategories,
  mediaMapping,
  parseAPIAlbums
} from '@/common/mapping';

import {
  PictureAssetEntity,
  VideoAssetEntity
} from '@/common/models/entities/asset';

export const getPhotosApi = async (id, terms = [], projectId) => {
  if (isEmpty(terms)) return [];

  const res = await graphqlRequest(getMediaQuery, { id, terms, projectId });

  if (!isOk(res)) return [];

  return res.data.search_community_assets
    ?.filter(asset => !asset.is_media)
    .map(asset => new PictureAssetEntity(mediaMapping(asset)));
};

export const getMediaApi = async (id, terms = [], projectId) => {
  if (isEmpty(terms)) return [];

  const res = await graphqlRequest(getMediaQuery, { id, terms, projectId });

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
export const getAssetByIdApi = async (assetId, projectId) => {
  const res = await graphqlRequest(getAssetByIdQuery, {
    id: assetId,
    projectId
  });

  if (!isOk(res)) return;

  const asset = res.data.asset;
  return asset.is_media
    ? new VideoAssetEntity(mediaMapping(asset, !asset.is_media))
    : new PictureAssetEntity(mediaMapping(asset));
};

export const getAlbumsAndCategoriesApi = async (
  communityId,
  projectId,
  isGetVideo
) => {
  const res = await graphqlRequest(getAllAlbumsQuery, {
    communityId,
    projectId
  });

  if (!isOk(res)) return;

  const communities = get(res, 'data.community_containers', []);
  const groups = get(res, 'data.community_group_assets', []);
  const personalAlbums = get(res, 'data.user_containers', []);

  // mapping list of categories
  const albumCategories = {
    communities: extractAlbumCategories(communities, isGetVideo),
    groups: extractAlbumCategories(groups, isGetVideo),
    personalAlbums: extractAlbumCategories(personalAlbums, isGetVideo)
  };

  // normalize albums
  const albums = {
    communities: parseAPIAlbums(communities),
    groups: parseAPIAlbums(groups),
    personalAlbums: parseAPIAlbums(personalAlbums)
  };

  return { albumCategories, albums };
};

/**
 * To get in project asset of book and current page / frame
 * @param {String} bookId id of current book
 * @param {String} projectId id of current project (page / frames)
 * @returns assets id of current project and of whole book
 */
export const getInProjectAssetsApi = async (bookId, projectId) => {
  const res = await graphqlRequest(getInProjectAssetsQuery, {
    bookId,
    projectId
  });
  if (!isOk(res)) return {};

  const assets = get(res, 'data.book.in_project_assets', []);

  const apiPageAssetIds = assets
    .filter(asset => asset.in_project)
    .map(asset => asset.id);
  const apiBookAssetIds = assets.map(asset => asset.id);
  return { apiBookAssetIds, apiPageAssetIds };
};
