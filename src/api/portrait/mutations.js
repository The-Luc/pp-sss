import { gql } from 'graphql-tag';

export const saveSettingMutation = gql`
  mutation saveSettingMutation(
    $bookId: ID!
    $params: PortraitLayoutSettingInput
  ) {
    create_portrait_layout_setting(
      book_id: $bookId
      portrait_layout_setting_params: $params
    ) {
      name
      teacher_settings
      text_settings
      image_settings
      layout_settings
      created_at
    }
  }
`;

export const addBookPortraitMutation = gql`
  mutation addBookPotrait($bookPotraitParams: BooksPortraitCollectionsInput) {
    create_books_portrait_collections(
      books_portrait_collections_params: $bookPotraitParams
    ) {
      portrait_collection {
        id
      }
    }
  }
`;

export const createPortraitSheetMutation = gql`
  mutation createPortraitSheet($sheetId: ID!, $collections: [ID]!) {
    create_portrait_sheet_setting(
      sheet_id: $sheetId
      portrait_layout_setting_id: ""
      portrait_collection_ids: $collections
    ) {
      sheet {
        id
      }
      portrait_collections {
        id
      }
    }
  }
`;

export const deletePortraitSheetMutation = gql`
  mutation deletePortraitSheet($id: ID!) {
    delete_portrait_sheet_setting(portrait_sheet_setting_id: $id) {
      id
    }
  }
`;
