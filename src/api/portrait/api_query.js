import { get } from 'lodash';
import moment from 'moment';

import UniqueId from '@/plugins/customUniqueId';

import { MOMENT_TYPE } from '@/common/constants';

import { graphqlRequest } from '../urql';

import {
  portraitAssetMapping,
  portraitMapping,
  portraitSettingsMapping
} from '@/common/mapping';

import { isOk } from '@/common/utils';

import { PortraitAsset, PortraitFolder } from '@/common/models';

import {
  portraitFolders,
  getPrintSettingsQuery,
  getDigitalSettingsQuery
} from './queries';
import { EDITION } from '@/common/constants';

const getPortraitAssets = assets => {
  return assets.map(asset => new PortraitAsset(portraitAssetMapping(asset)));
};

export const getPortraitFoldersApi = async ({ bookId }) => {
  const response = await graphqlRequest(portraitFolders, { id: bookId });

  if (!isOk(response)) return [];

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

  const edition = isDigital ? EDITION.DIGITAL : EDITION.PRINT;

  res.data.book.print_portrait_layout_settings.sort((s1, s2) => {
    const d1 = moment(new Date(s1.created_at));
    const d2 = moment(new Date(s2.created_at));

    return d2.diff(d1, MOMENT_TYPE.SECOND, false);
  });

  return res.data.book.print_portrait_layout_settings.map(s => {
    return {
      ...portraitSettingsMapping(s),
      id: UniqueId.generateId(`portrait-setting-${edition}-`)
    };
  });
};
