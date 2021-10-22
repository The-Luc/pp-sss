import { mapObject } from '@/common/utils';

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
      }
    },
    restrict: []
  };

  return mapObject(asset, mapRules);
};
