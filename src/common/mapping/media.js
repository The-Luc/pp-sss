import { apiToShortDate, mapObject, isEmpty } from '@/common/utils';
import { ALL_MEDIA_SUBCATEGORY_ID, ASSET_TYPE } from '@/common/constants';

/**
 * Convert asset data from API to data of Media Model
 *
 * @param   {Object}  asset asset data from API
 * @returns {Object}        asset data use by model
 */
export const mediaMapping = (asset, isPhoto = true) => {
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
      },
      in_project: {
        name: 'inProject'
      }
    },
    restrict: []
  };

  return mapObject(asset, mapRules);
};

const addingCategoryAll = category =>
  !isEmpty(category) &&
  category.unshift({
    id: ALL_MEDIA_SUBCATEGORY_ID,
    name: 'All'
  });

/**
 *  To get album categories from API containers
 *
 * @param {Array} albumArr api container data
 * @returnsa {Array} category showed in dropdown menu
 */
export const extractAlbumCategories = (albumArr, isGetVideo) => {
  const getAlbumCategory = album => {
    const isSelectedMediaExited = album.assets.some(
      asset => asset.is_media === Boolean(isGetVideo)
    );
    return isSelectedMediaExited ? { id: album.id, name: album.body } : null;
  };

  const categories = albumArr.map(a => {
    if (!a.containers) return getAlbumCategory(a);

    const albums = a.containers.map(al => getAlbumCategory(al)).filter(Boolean);
    addingCategoryAll(albums);
    return { id: a.id, name: a.name, albums };
  });

  categories[0]?.albums || addingCategoryAll(categories);

  return categories.filter(Boolean);
};

/**
 *  To convert backend album structure to frontend structrue
 *
 * @param {Array} albumArr api container data
 * @returns {Array} array of albums that can be used in FE
 */
export const parseAPIAlbums = albumArr => {
  const parsedAlbums = albumArr.map(al => {
    const containers = al.containers ? al.containers : [al];

    return containers.map(container => {
      const mediaAssets = container.assets || [];
      const assets = mediaAssets.map(
        ({ id, thumbnail_uri, is_media, in_project }) => ({
          id,
          thumbUrl: thumbnail_uri,
          type: is_media ? ASSET_TYPE.VIDEO : ASSET_TYPE.PICTURE,
          albumId: container.id,
          inProject: in_project
        })
      );

      return {
        id: container.id,
        assets,
        displayDate: apiToShortDate(container.created_at),
        name: container.body
      };
    });
  });
  return parsedAlbums.flat();
};
