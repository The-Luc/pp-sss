import { get } from 'lodash';
import moment from 'moment';

import { MOMENT_TYPE, EDITION } from '@/common/constants';

import { graphqlRequest } from '../urql';

import {
  portraitAssetMapping,
  portraitMapping,
  portraitSettingsMapping
} from '@/common/mapping';

import { isOk } from '@/common/utils';

import { PortraitAsset, PortraitFolder } from '@/common/models';

import UniqueId from '@/plugins/UniqueId';
import {
  portraitFolders,
  getPrintSettingsQuery,
  getDigitalSettingsQuery,
  portraitFoldersSelectedQuery,
  sheetPortraitQuery
} from './queries';

const getPortraitAssets = assets => {
  return assets.map(asset => new PortraitAsset(portraitAssetMapping(asset)));
};

export const getPortraitFoldersIdSelected = async bookId => {
  const res = await graphqlRequest(portraitFoldersSelectedQuery, { bookId });
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
    const isSelected = portraitFoldersIdSelected.includes(portrait.id);

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

export const sheetPortraitApi = async sheetId => {
  const res = await graphqlRequest(sheetPortraitQuery, { sheetId });

  const portraitSheet = get(res, 'data.sheet.portrait_sheet_setting');

  if (!portraitSheet || !portraitSheet.portrait_collections) return {};

  return {
    id: portraitSheet.id,
    collectionIds: portraitSheet.portrait_collections.map(({ id }) => id)
  };
};
