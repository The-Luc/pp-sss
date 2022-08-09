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
  updateDeleteTemplateUser,
  updateBookCollectionCache,
  updatePresentColorPickerCache,
  createUserCustomPrintTemplate,
  createUserCustomDigitalTemplateCache,
  updateTextStyle,
  updateImageStyle,
  createContainerCache,
  updateProjectMappingConfig,
  invalidateLayoutMapping,
  deletePortraitSheet,
  createPortraitSheet
} from './cacheUpdater';

let requestCount = 0;

const fetchOptions = () => {
  const token = getItem(LOCAL_STORAGE.TOKEN);
  return {
    headers: { authorization: token ? `Bearer ${token}` : '' }
  };
};

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
        UploaderTokenType: () => null,
        PortraitLayoutSetting: res => res['created_at']
      },
      updates: {
        Mutation: {
          create_portrait_layout_setting: updatePortraitSettingCache,
          create_books_portrait_collections: updateBookCollectionCache,
          create_template_user: updateTemplateUserCache,
          delete_template_user: updateDeleteTemplateUser,
          update_sheet: updateSheetCache,
          delete_sheet: updateDeleteSheet,
          create_sheet: updateCreateSheet,
          move_sheet: moveSheetCache,
          delete_book_section: updateDeleteSection,
          create_book_section: updateCreateSection,
          update_book_section: updateSectionCache,
          delete_digital_frame: updateDeleteFrame,
          create_digital_frame: updateCreateFrame,
          update_user_favourite_colors: updatePresentColorPickerCache,
          create_user_custom_print_template: createUserCustomPrintTemplate,
          create_user_custom_digital_template: createUserCustomDigitalTemplateCache,
          create_text_style: updateTextStyle,
          create_image_style: updateImageStyle,
          create_container: createContainerCache,
          update_project_mapping_configuration: updateProjectMappingConfig,
          delete_template_element_mappings: invalidateLayoutMapping,
          create_bulk_template_element_mapping: invalidateLayoutMapping,
          delete_portrait_sheet_setting: deletePortraitSheet,
          create_portrait_sheet_setting: createPortraitSheet
        }
      }
    }),
    fetchExchange
  ],
  fetchOptions
});

// ignore cache data
const urqlNetworkClient = createClient({
  url: process.env.VUE_APP_API_ENDPOINT,
  requestPolicy: 'network-only',
  exchanges: [devtoolsExchange, dedupExchange, fetchExchange],
  fetchOptions
});

/**
 * adding additional query to url to show request name on chrome dev tools
 */
const addOptionQuery = (url, name) => {
  const key = '?op=';
  const pureUrl = url.split(key)[0];

  return pureUrl + key + name;
};

/**
 *  To make a request to server
 *
 * @param {String} query query or mutation of graphql
 * @param {Object} variables variables of query or mutations
 * @param {Boolean} isHideSpiner true if it's autosave
 * @param {Boolean} isIgnoreCache true if ignore cache data
 * @returns <Promise>
 */
export const graphqlRequest = async (
  query,
  variables,
  isHideSpiner,
  isIgnoreCache
) => {
  try {
    const { operation, name } = query.definitions[0];
    const queryVars = variables || {};

    const client = isIgnoreCache ? urqlNetworkClient : urqlClient;

    // adding query option so that we can see reqeust name on chrome dev tool
    client.url = addOptionQuery(client.url, name?.value);

    if (isHideSpiner) {
      const results = await client[operation](query, queryVars).toPromise();
      return responseHandler(results);
    }

    // show loading screen
    store.commit(APP_MUTATES.SET_LOADING_STATE, { value: true });
    requestCount++;

    const res = await client[operation](query, queryVars).toPromise();

    // hide loading screen
    requestCount--;
    if (requestCount === 0)
      store.commit(APP_MUTATES.SET_LOADING_STATE, { value: false });

    return responseHandler(res);
  } catch (error) {
    return responseHandler({ error });
  }
};
