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
  getDigitalSettingsQuery,
  PortraitFoldersSelected
} from './queries';
import { EDITION } from '@/common/constants';

const getPortraitAssets = assets => {
  return assets.map(asset => new PortraitAsset(portraitAssetMapping(asset)));
};

export const getPortraitFoldersIdSelected = async bookId => {
  const res = await graphqlRequest(PortraitFoldersSelected, { bookId });
  return res.data.books_portrait_collections_by_book.map(
    collection => collection.portrait_collection.id
  );
};

export const getPortraitFoldersApi = async ({ bookId }) => {
  const response = await graphqlRequest(portraitFolders, { id: bookId });
  const portraitFoldersIdSelected = await getPortraitFoldersIdSelected(bookId);

  if (!isOk(response)) return [];

  const portraitCollections = get(
    response.data,
    'book.community.portrait_collections',
    []
  );

  return portraitCollections.map(portrait => {
    const portraitSubjects = get(portrait, 'portrait_subjects', []);
    const assets = getPortraitAssets(portraitSubjects);
    const isSelected = {
      digital: portraitFoldersIdSelected.includes(portrait.id),
      print: portraitFoldersIdSelected.includes(portrait.id)
    };

    return new PortraitFolder({
      ...portraitMapping(portrait),
      assets,
      isSelected
    });
  });
};

export const getPortraiSettingsApi = async (bookId, isDigital) => {
  const query = isDigital ? getDigitalSettingsQuery : getPrintSettingsQuery;

  const res = await graphqlRequest(query, { bookId });

  if (!isOk(res)) return [];

  const edition = isDigital ? EDITION.DIGITAL : EDITION.PRINT;
  const settingEdition = isDigital
    ? 'digital_portrait_layout_settings'
    : 'print_portrait_layout_settings';

  res.data.book[settingEdition].sort((s1, s2) => {
    const d1 = moment(new Date(s1.created_at));
    const d2 = moment(new Date(s2.created_at));

    return d2.diff(d1, MOMENT_TYPE.SECOND, false);
  });

  return res.data.book[settingEdition].map(s => {
    return {
      ...portraitSettingsMapping(s),
      id: UniqueId.generateId(`portrait-setting-${edition}-`)
    };
  });
};
