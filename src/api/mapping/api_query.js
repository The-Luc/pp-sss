import { graphqlRequest } from '../urql';
import { getMappingSettingsQuery, getSheetMappingConfigQuery } from './queries';

export const getMappingConfigApi = bookId => {
  return graphqlRequest(getMappingSettingsQuery, { bookId });
};

export const getSheetMappingConfigApi = sheetId => {
  return graphqlRequest(getSheetMappingConfigQuery, { id: sheetId });
};
