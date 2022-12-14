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
    $noLeftPage: Boolean!
    $noRightPage: Boolean!
  ) {
    leftPage: update_page(page_id: $leftId, page_params: $leftParams)
      @skip(if: $noLeftPage) {
      id
      show_page_number
      title
    }
    rightPage: update_page(page_id: $rightId, page_params: $rightParams)
      @skip(if: $noRightPage) {
      id
      show_page_number
      title
    }
    update_sheet(sheet_id: $sheetId, sheet_params: $sheetParams) {
      id
      is_visited
    }
    update_book(book_id: $bookId, book_params: $bookParams) {
      id
      print_theme_id
      page_number_position
      print_page_numbers
    }
    update_book_properties(book_id: $bookId, properties: $properties)
      @include(if: $isUpdatePageInfo) {
      id
      properties
    }
  }
`;

export const savePrintObjectMutation = gql`
  mutation savePrintData(
    $leftId: ID!
    $leftParams: PageInput!
    $rightId: ID!
    $rightParams: PageInput!
    $noLeftPage: Boolean!
    $noRightPage: Boolean!
  ) {
    leftPage: update_page(page_id: $leftId, page_params: $leftParams)
      @skip(if: $noLeftPage) {
      id
      layout
      preview_image_url
    }
    rightPage: update_page(page_id: $rightId, page_params: $rightParams)
      @skip(if: $noRightPage) {
      id
      layout
      preview_image_url
    }
  }
`;

export const addInProjectMutation = gql`
  mutation addInProject(
    $assetId: ID!
    $projectId: ID!
    $projectIdInt: Int!
    $type: ProjectTypesType!
  ) {
    create_asset_designable(
      asset_id: $assetId
      designable_id: $projectId
      designable_type: $type
    ) {
      id
      in_project(project_id: $projectIdInt, project_type: $type)
    }
  }
`;

export const removeInProjectMutation = gql`
  mutation removeInProject(
    $assetId: ID!
    $projectId: ID!
    $projectIdInt: Int!
    $type: ProjectTypesType!
  ) {
    delete_assets_designable(
      asset_id: $assetId
      designable_id: $projectId
      designable_type: $type
    ) {
      id
      in_project(project_id: $projectIdInt, project_type: $type)
    }
  }
`;
