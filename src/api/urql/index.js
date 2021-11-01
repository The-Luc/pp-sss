import { createClient, dedupExchange, fetchExchange } from '@urql/core';
import { cacheExchange } from '@urql/exchange-graphcache';
import store from '@/store';
import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';
import { getItem } from '@/common/storage';
import { LOCAL_STORAGE } from '@/common/constants';
import responseHandler from './responseHandler';

let requestCount = 0;

const urqlClient = createClient({
  url: process.env.VUE_APP_API_ENDPOINT,
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys: {
        Page: () => null,
        YearbookSpec: () => null,
        Template: () => null,
        Category: () => null
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

export const graphqlRequest = async (query, variables = {}) => {
  const { operation } = query.definitions[0];

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
