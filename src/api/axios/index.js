import { createClient, dedupExchange, fetchExchange } from '@urql/core';
import { cacheExchange } from '@urql/exchange-graphcache';

import { getItem } from '@/common/storage';
import { LOCAL_STORAGE } from '@/common/constants';
import dataHandler from './dataHandler';
import errorHandler from './errorHandler';

const urqlClient = createClient({
  url: process.env.VUE_APP_API_ENDPOINT,
  exchanges: [dedupExchange, cacheExchange({}), fetchExchange],
  fetchOptions: () => {
    const token = getItem(LOCAL_STORAGE.TOKEN);
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' }
    };
  }
});

export const graphqlRequest = async (query, variables = {}) => {
  try {
    const { operation } = query.definitions[0];

    const res = await urqlClient[operation](query, variables).toPromise();

    return dataHandler(res);
  } catch (error) {
    return errorHandler(error);
  }
};
