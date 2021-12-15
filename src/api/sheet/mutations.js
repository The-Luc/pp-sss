import { gql } from 'graphql-tag';

export const addSheetMutation = gql`
  mutation addSheet($sectionId: ID!, $params: SheetInput) {
    create_sheet(book_section_id: $sectionId, sheet_params: $params) {
      id
      book {
        id
      }
    }
  }
`;

export const updateSheetMutation = gql`
  mutation updateSheet($sheetId: ID!, $params: SheetInput) {
    update_sheet(sheet_id: $sheetId, sheet_params: $params) {
      id
    }
  }
`;

export const updateSheetOrderMutation = gql`
  mutation updateSheetOrder($sectionId: ID!, $sheetIds: [Int]) {
    update_sheet_order(
      book_section_id: $sectionId
      sheet_order_ids: $sheetIds
    ) {
      id
      sheet_order
    }
  }
`;

export const updateSheetLinkMutation = gql`
  mutation updateSheetLink(
    $sheetId: ID!
    $sheetParams: SheetInput
    $leftPageId: ID!
    $rightPageId: ID!
    $pageParams: PageInput!
  ) {
    sheet: update_sheet(sheet_id: $sheetId, sheet_params: $sheetParams) {
      id
      linked
    }
    leftPage: update_page(page_id: $leftPageId, page_params: $pageParams) {
      id
      title
    }
    rightPage: update_page(page_id: $rightPageId, page_params: $pageParams) {
      id
      title
    }
  }
`;

export const moveSheetMutation = gql`
  mutation moveSheet($sectionId: ID!, $targetIndex: Int!, $sheetId: ID!) {
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
  mutation deleteSheet($sheetId: ID!) {
    delete_sheet(sheet_id: $sheetId) {
      id
      book {
        id
      }
    }
  }
`;
