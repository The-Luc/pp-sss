import { gql } from 'graphql-tag';

export const themeOptionsQuery = gql`
  query themeOptions {
    themes {
      id
      name
      preview_image_url
      digital_preview_image_url
      template_book_pair {
        id
        template_book {
          id
          preview_image_url
        }
      }
    }
  }
`;
export const getThemeDefaultQuery = gql`
  query getThemeDefault($bookId: ID!) {
    book(id: $bookId) {
      id
      print_theme_id
      digital_theme_id
    }
  }
`;
