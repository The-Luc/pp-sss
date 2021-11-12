import { gql } from 'graphql-tag';

export const addSheetMutation = gql`
  mutation($sectionId: ID!, $params: SheetInput) {
    create_sheet(book_section_id: $sectionId, sheet_params: $params) {
      id
    }
  }
`;

export const updateSheetMutation = gql`
  mutation($sheetId: ID!, $params: SheetInput) {
    update_sheet(sheet_id: $sheetId, sheet_params: $params) {
      id
    }
  }
`;

export const deleteSheetMutation = gql`
  mutation($sheetId: ID!) {
    delete_sheet(sheet_id: $sheetId) {
      id
    }
  }
`;
