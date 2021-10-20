import { PortraitAsset, PortraitFolder } from '@/common/models';
import { mapObject } from '@/common/utils';
import { get } from 'lodash';
import { graphqlRequest } from '../axios';
import { portraitFolders } from './queries';

export const getPortraitFolders = async ({ bookId }) => {
  const response = await graphqlRequest(portraitFolders, { id: bookId });
  const portraitCollections = get(
    response,
    'book.community.portrait_collections',
    []
  );

  return portraitCollections.map(portrait => {
    const portraitSubjects = get(portrait, 'portrait_subjects', []);
    const assets = getPortraitAssets(portraitSubjects);

    return new PortraitFolder({
      ...apiPortraitToModel(portrait),
      assets
    });
  });
};

const apiPortraitToModel = portrait => {
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

const apiPortraitAssetToModel = asset => {
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

const getPortraitAssets = assets => {
  return assets.map(asset => new PortraitAsset(apiPortraitAssetToModel(asset)));
};
