import { gql } from 'graphql-tag';

export const savePrintDataMutation = gql`
  mutation savePrintData(
    $leftId: ID!
    $leftParams: PageInput!
    $rightId: ID!
    $rightParams: PageInput!
    $sheetId: ID!
    $sheetParams: SheetInput
    $bookId: ID!
    $bookParams: BookInput!
    $properties: BookPropertiesInput
    $isUpdatePageInfo: Boolean!
  ) {
    leftPage: update_page(page_id: $leftId, page_params: $leftParams) {
      id
      is_visited
      layout
      page_number
      preview_image_url
      show_page_number
      title
    }
    rightPage: update_page(page_id: $rightId, page_params: $rightParams) {
      id
      is_visited
      layout
      page_number
      preview_image_url
      show_page_number
      title
    }
    update_sheet(sheet_id: $sheetId, sheet_params: $sheetParams) {
      id
    }
    update_book(book_id: $bookId, book_params: $bookParams)
      @include(if: $isUpdatePageInfo) {
      id
    }
    update_book_properties(book_id: $bookId, properties: $properties)
      @include(if: $isUpdatePageInfo) {
      properties
    }
  }
`;
