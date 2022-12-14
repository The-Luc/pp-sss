import { graphqlRequest } from '../urql';
import { get } from 'lodash';
import { isEmpty, isOk } from '@/common/utils';
import {
  getAssetByIdQuery,
  getInProjectAssetsQuery,
  getMediaQuery,
  getAlbumCategoryQuery,
  getUserAlbumsQuery,
  getCommunityAlbumsQuery,
  getQrrentByIdQuery,
  getAlbumByIdQuery,
  getUserAvailableAlbumsQuery
} from './queries';
import {
  containerMapping,
  extractAlbumCategories,
  mediaMapping,
  parseAPIAlbums
} from '@/common/mapping';

import {
  PictureAssetEntity,
  VideoAssetEntity
} from '@/common/models/entities/asset';
import axios from 'axios';
import responseHandler from '../urql/responseHandler';

export const getPhotosApi = async (id, projectId, terms = []) => {
  if (isEmpty(terms)) return [];

  const res = await graphqlRequest(getMediaQuery, { id, terms, projectId });

  if (!isOk(res)) return [];

  return res.data.search_community_assets
    ?.filter(asset => !asset.is_media)
    .map(asset => new PictureAssetEntity(mediaMapping(asset)));
};

export const getMediaApi = async (id, projectId, terms = []) => {
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

export const getAlbumCategoryApi = async communityId => {
  const res = await graphqlRequest(getAlbumCategoryQuery, {
    communityId
  });

  if (!isOk(res)) return [];

  const communities = get(res, 'data.community_containers', []);
  const groups = get(res, 'data.community_group_assets', []);
  const personalAlbums = get(res, 'data.user_containers', []);

  const personalCate = extractAlbumCategories(personalAlbums).reverse();
  personalCate.unshift(personalCate.pop());

  // mapping list of categories
  return {
    communities: extractAlbumCategories(communities),
    groups: extractAlbumCategories(groups, true),
    personalAlbums: personalCate || []
  };
};

export const getUserAlbumsApi = async (_, projectId) => {
  const res = await graphqlRequest(getUserAlbumsQuery, {
    projectId
  });

  if (!isOk(res)) return;

  const personalAlbums = get(res, 'data.user_containers', []);

  return parseAPIAlbums(personalAlbums).reverse();
};

export const getCommunityAlbumsApi = async (communityId, projectId, page) => {
  const res = await graphqlRequest(getCommunityAlbumsQuery, {
    communityId,
    projectId,
    page
  });

  if (!isOk(res)) return;

  const communities = get(res, 'data.community_containers', []);

  return parseAPIAlbums(communities);
};

export const getAlbumByIdApi = async (id, projectId) => {
  const res = await graphqlRequest(getAlbumByIdQuery, {
    id,
    projectId
  });

  if (!isOk(res)) return;

  const album = get(res, 'data.container', []);
  // normalize albums
  return containerMapping(album);
};

/**
 *  Qrrent is a group of albums
 */
export const getQrrentByIdApi = async (id, projectId) => {
  const res = await graphqlRequest(getQrrentByIdQuery, {
    id,
    projectId
  });

  if (!isOk(res)) return;

  const container = get(res, 'data.qrrent', []);
  // normalize albums
  return parseAPIAlbums([container]).reverse();
};

/**
 * To get in project asset of book and current page / frame
 * @param {String} bookId id of current book
 * @param {String | Array} projectId id of current project (pages / frame)
 * @param {Boolean} isDigital is digital edition or not
 * @returns assets id of current project and of whole book
 */
export const getInProjectAssetsApi = async (bookId, projectId, isDigital) => {
  const type = isDigital ? 'DIGITAL_FRAME' : 'PAGE';

  const projectIdsArray = Array.isArray(projectId) ? projectId : [projectId];

  const promises = projectIdsArray.map(id =>
    graphqlRequest(
      getInProjectAssetsQuery,
      {
        bookId,
        projectId: +id,
        type
      },
      true
    )
  );

  const res = await Promise.all(promises);

  if (!isOk(res)) return {};

  const leftAssets = get(res[0], 'data.book.in_project_assets', []);
  const rightAssets = get(res[1], 'data.book.in_project_assets', []);

  const leftPageAssetIds = leftAssets
    .filter(asset => asset.in_project)
    .map(asset => asset.id);

  const rightPageAssetIds = rightAssets
    .filter(asset => asset.in_project)
    .map(asset => asset.id);

  const apiPageAssetIds = [...leftPageAssetIds, ...rightPageAssetIds];

  const apiBookAssetIds = leftAssets.map(asset => asset.id);
  return {
    apiBookAssetIds,
    apiPageAssetIds,
    leftPageAssetIds,
    rightPageAssetIds
  };
};

export const getUserAvailableAlbumApi = async () => {
  const res = await graphqlRequest(
    getUserAvailableAlbumsQuery,
    {},
    false,
    true
  );

  if (!isOk(res)) return;

  const albums = get(res, 'data.user_available_containers');

  return parseAPIAlbums(albums).reverse();
};

/**
 * To upload media file to Platypus
 *
 * @param {Object} asset File data
 * @param {Object} uploadToken upload token
 * @returns upload asset object
 */
export const uploadAssetsApi = async (asset, uploadToken) => {
  try {
    const { url, token } = uploadToken;

    const formData = new FormData();
    formData.append('upload', asset);
    formData.append('authenticationToken', token);

    return axios.post(url, formData);
  } catch (error) {
    error.message = ` An error occurred while uploading ${asset.name}`;
    return responseHandler({ error });
  }
};
