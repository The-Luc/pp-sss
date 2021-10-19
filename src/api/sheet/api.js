import { graphqlRequest } from '../axios';
import { pageInfoQuery } from './queries';

const sheetService = {
  getPageData: async id => graphqlRequest(pageInfoQuery, { id })
};

export default sheetService;
