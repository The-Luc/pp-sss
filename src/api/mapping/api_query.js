import { graphqlRequest } from '../urql';
import { get } from 'lodash';
import {
  getBookConnectionsQuery,
  getMappingSettingsQuery,
  getSheetMappingConfigQuery,
  getSheetMappingElementsQuery
} from './queries';

export const getMappingConfigApi = bookId => {
  return graphqlRequest(getMappingSettingsQuery, { bookId });
};

export const getSheetMappingConfigApi = sheetId => {
  return graphqlRequest(getSheetMappingConfigQuery, { id: sheetId });
};

export const getSheetMappingElementsApi = async sheetId => {
  const res = await graphqlRequest(
    getSheetMappingElementsQuery,
    { sheetId },
    false,
    true
  );

  const elementMappings = get(res, 'data.sheet.element_mappings', []);

  return elementMappings.map(el => ({
    id: el.id,
    printElementId: el.print_element_uid,
    digitalElementId: el.digital_element_uid,
    printContainerId: sheetId,
    digitalContainerId: el.digital_frame?.id,
    mapped: el.mapped
  }));
};

export const getBookConnectionsApi = async bookId => {
  const res = await graphqlRequest(getBookConnectionsQuery, { bookId });

  const sheets = get(res, 'data.book.sheets');

  return sheets.map(sheet => sheet.element_mappings.map(el => el.id)).flat();
};
