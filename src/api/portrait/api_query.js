import { get } from 'lodash';

import { graphqlRequest } from '../urql';

import {
  portraitAssetMapping,
  portraitMapping,
  portraitSettingsMapping
} from '@/common/mapping';

import { PortraitAsset, PortraitFolder } from '@/common/models';

import {
  portraitFolders,
  getPrintSettingsQuery,
  getDigitalSettingsQuery
} from './queries';
import { isOk, getUniqueId } from '@/common/utils';

const getPortraitAssets = assets => {
  return assets.map(asset => new PortraitAsset(portraitAssetMapping(asset)));
};

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

export const getPortraiSettingsApi = async (bookId, isDigital) => {
  const query = isDigital ? getDigitalSettingsQuery : getPrintSettingsQuery;

  const res = await graphqlRequest(query, { bookId });

  if (!isOk(res)) return [];

  return res.data.book.print_portrait_layout_settings.map(s => {
    return {
      ...portraitSettingsMapping(s),
      id: getUniqueId()
    };
  });
};
