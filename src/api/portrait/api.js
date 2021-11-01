import { get } from 'lodash';

import { graphqlRequest } from '../urql';

import { portraitAssetMapping, portraitMapping } from '@/common/mapping';

import { PortraitAsset, PortraitFolder } from '@/common/models';

import { portraitFolders } from './queries';

export const getPortraitFolders = async ({ bookId }) => {
  const response = await graphqlRequest(portraitFolders, { id: bookId });
  const portraitCollections = get(
    response.data,
    'book.community.portrait_collections',
    []
  );

  return portraitCollections.map(portrait => {
    const portraitSubjects = get(portrait, 'portrait_subjects', []);
    const assets = getPortraitAssets(portraitSubjects);

    return new PortraitFolder({
      ...portraitMapping(portrait),
      assets
    });
  });
};

const getPortraitAssets = assets => {
  return assets.map(asset => new PortraitAsset(portraitAssetMapping(asset)));
};
