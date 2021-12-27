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
      id
    }
  }
`;
