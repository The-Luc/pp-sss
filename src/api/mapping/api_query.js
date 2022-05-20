import { graphqlRequest } from '../urql';
import { getMappingSettingsQuery } from './queries';

export const getMappingConfigApi = bookId => {
  return graphqlRequest(getMappingSettingsQuery, { bookId });
};
