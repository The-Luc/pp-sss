import { gql } from 'graphql-tag';

export const portraitFolders = gql`
  query portraitFolders($id: ID!) {
    book(id: $id) {
      id
      community {
        id
        portrait_collections {
          id
          name
          thumb_url
          assets_count
          portrait_subjects {
            first_name
            last_name
            full_name
            subject_type
            primary_portrait_image
          }
        }
      }
    }
  }
`;

const settingsFragment = gql`
  fragment settings on PortraitLayoutSetting {
    name
    teacher_settings
    text_settings
    image_settings
    layout_settings
    created_at
  }
`;

export const getPrintSettingsQuery = gql`
  query getSettingsQuery($bookId: ID!) {
    book(id: $bookId) {
      id
      print_portrait_layout_settings {
        ...settings
      }
    }
  }
  ${settingsFragment}
`;

export const getDigitalSettingsQuery = gql`
  query getSettingsQuery($bookId: ID!) {
    book(id: $bookId) {
      id
      digital_portrait_layout_settings {
        ...settings
      }
    }
  }
  ${settingsFragment}
`;

export const portraitFoldersSelectedQuery = gql`
  query bookPortrait($bookId: ID!) {
    books_portrait_collections_by_book(book_id: $bookId) {
      id
      portrait_collection {
        id
      }
    }
  }
`;

export const sheetPortraitQuery = gql`
  query sheetPotrait($sheetId: ID!) {
    sheet(id: $sheetId) {
      id
      portrait_sheet_setting {
        id
        portrait_collections {
          id
        }
      }
    }
  }
`;
