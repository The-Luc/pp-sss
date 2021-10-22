import { mapObject } from '@/common/utils';

/**
 * Convert asset data from API to data of Media Model
 *
 * @param   {Object}  asset asset data from API
 * @returns {Object}        asset data use by model
 */

export const portraitMapping = portrait => {
  const mapRules = {
    data: {
      assets_count: {
        name: 'assetsCount'
      },
      thumb_url: {
        name: 'thumbUrl'
      }
    },
    restrict: ['portrait_subjects']
  };

  return mapObject(portrait, mapRules);
};

export const portraitAssetMapping = asset => {
  const mapRules = {
    data: {
      first_name: {
        name: 'firstName'
      },
      last_name: {
        name: 'lastName'
      },
      portrait_thumbnail: {
        name: 'thumbUrl'
      },
      primary_portrait_image: {
        name: 'imageUrl'
      },
      subject_type: {
        name: 'classRole'
      }
    },
    restrict: []
  };

  return mapObject(asset, mapRules);
};
