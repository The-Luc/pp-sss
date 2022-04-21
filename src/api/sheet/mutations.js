import { gql } from 'graphql-tag';

export const addSheetMutation = gql`
  mutation addSheet(
    $sectionId: ID!
    $createSheetParams: SheetInput
    $sheetId: ID!
    $updateSheetParams: SheetInput
    $isUpdate: Boolean!
  ) {
    create_sheet(
      book_section_id: $sectionId
      sheet_params: $createSheetParams
    ) {
      id
      book {
        id
      }
    }
    update_sheet(sheet_id: $sheetId, sheet_params: $updateSheetParams)
      @include(if: $isUpdate) {
      id
      sheet_order
    }
  }
`;

export const updateSheetMutation = gql`
  mutation updateSheet($sheetId: ID!, $params: SheetInput) {
    update_sheet(sheet_id: $sheetId, sheet_params: $params) {
      id
      is_visited
      sheet_order
      workspace
      digital_workspace
      linked
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
  mutation moveSheet(
    $sectionId: ID!
    $targetIndex: Int!
    $sheetId: ID!
    $sheetIds: [Int]
  ) {
    move_sheet(
      target_book_section_id: $sectionId
      target_placement: $targetIndex
      sheet_id: $sheetId
    ) {
      book {
        id
      }
      id
    }
    update_sheet_order(
      book_section_id: $sectionId
      sheet_order_ids: $sheetIds
    ) {
      id
      sheet_order
    }
  }
`;

export const deleteSheetMutation = gql`
  mutation deleteSheet(
    $sheetId: ID!
    $sectionId: ID!
    $sheetIds: [Int]
    $isUpdateOrder: Boolean!
  ) {
    delete_sheet(sheet_id: $sheetId) {
      id
      book {
        id
        total_pages
      }
    }
    update_sheet_order(book_section_id: $sectionId, sheet_order_ids: $sheetIds)
      @include(if: $isUpdateOrder) {
      id
      sheet_order
    }
  }
`;
