import { mapObject, apiToShortDate } from '@/common/utils';

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

/**
 * Convert portrait data to data of Api
 *
 * @param   {Object}  section portrait data use by model
 * @returns {Object}          portrait data from API
 */
export const portraitSettingsMappingToApi = settings => {
  const mapRules = {
    data: {
      imageSettings: {
        name: 'image_settings',
        noSub: true,
        parse: value => JSON.stringify(value)
      },
      layoutSettings: {
        name: 'layout_settings',
        noSub: true,
        parse: value => JSON.stringify(value)
      },
      teacherSettings: {
        name: 'teacher_settings',
        noSub: true,
        parse: value => JSON.stringify(value)
      },
      textSettings: {
        name: 'text_settings',
        noSub: true,
        parse: value => JSON.stringify(value)
      }
    },
    restrict: []
  };

  return mapObject(settings, mapRules);
};

/**
 * Convert portrait data from API to model
 *
 * @param   {Object}  section portrait data from API
 * @returns {Object}          portrait data use by model
 */
export const portraitSettingsMapping = settings => {
  const mapRules = {
    data: {
      image_settings: {
        name: 'imageSettings',
        noSub: true
      },
      layout_settings: {
        name: 'layoutSettings',
        noSub: true
      },
      teacher_settings: {
        name: 'teacherSettings',
        noSub: true
      },
      text_settings: {
        name: 'textSettings',
        noSub: true
      },
      created_at: {
        name: 'savedDate',
        parse: value => apiToShortDate(value)
      }
    },
    restrict: []
  };

  return mapObject(settings, mapRules);
};
