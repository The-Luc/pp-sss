import { createClient, dedupExchange, fetchExchange } from '@urql/core';
import { devtoolsExchange } from '@urql/devtools';
import { cacheExchange } from '@urql/exchange-graphcache';
import store from '@/store';
import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';
import { getItem } from '@/common/storage';
import { LOCAL_STORAGE } from '@/common/constants';
import responseHandler from './responseHandler';
import {
  moveSheetCache,
  updateCreateFrame,
  updateCreateSection,
  updateCreateSheet,
  updateDeleteFrame,
  updateDeleteSection,
  updateDeleteSheet,
  updatePortraitSettingCache,
  updateSectionCache,
  updateSheetCache,
  updateTemplateUserCache,
  updateBookCollectionCache
} from './cacheUpdater';

let requestCount = 0;

const urqlClient = createClient({
  url: process.env.VUE_APP_API_ENDPOINT,
  exchanges: [
    devtoolsExchange,
    dedupExchange,
    cacheExchange({
      keys: {
        YearbookSpec: () => null,
        Category: () => null,
        PortraitSubject: () => null,
        Template: () => null,
        PortraitLayoutSetting: res => res['created_at']
      },
      updates: {
        Mutation: {
          create_portrait_layout_setting: updatePortraitSettingCache,
          create_books_portrait_collections: updateBookCollectionCache,
          create_template_user: updateTemplateUserCache,
          update_sheet: updateSheetCache,
          delete_sheet: updateDeleteSheet,
          create_sheet: updateCreateSheet,
          move_sheet: moveSheetCache,
          delete_book_section: updateDeleteSection,
          create_book_section: updateCreateSection,
          update_book_section: updateSectionCache,
          delete_digital_frame: updateDeleteFrame,
          create_digital_frame: updateCreateFrame
        }
      }
    }),
    fetchExchange
  ],
  fetchOptions: () => {
    const token = getItem(LOCAL_STORAGE.TOKEN);
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' }
    };
  }
});

export const graphqlRequest = async (query, variables = {}, isHideSpiner) => {
  const { operation } = query.definitions[0];

  if (isHideSpiner) {
    const res = await urqlClient[operation](query, variables).toPromise();
    return responseHandler(res);
  }

  // show loading screen
  store.commit(APP_MUTATES.SET_LOADING_STATE, { value: true });
  requestCount++;

  const res = await urqlClient[operation](query, variables).toPromise();

  // hide loading screen
  requestCount--;
  if (requestCount === 0)
    store.commit(APP_MUTATES.SET_LOADING_STATE, { value: false });

  return responseHandler(res);
};
