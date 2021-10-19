import graphQLRequest from '../axios';
import { pageInfoQuery } from './queries';

const sheetService = {
  getPageData: async id => graphQLRequest(pageInfoQuery, { id })
};

export default sheetService;
