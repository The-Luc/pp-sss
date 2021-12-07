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

export const updateSheetOrderMutation = gql`
  mutation($sectionId: ID!, $sheetIds: [Int]) {
    update_sheet_order(
      book_section_id: $sectionId
      sheet_order_ids: $sheetIds
    ) {
      id
    }
  }
`;

export const moveSheetMutation = gql`
  mutation($sectionId: ID!, $targetIndex: Int!, $sheetId: ID!) {
    move_sheet(
      target_book_section_id: $sectionId
      target_placement: $targetIndex
      sheet_id: $sheetId
    ) {
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
