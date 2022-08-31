import { gql } from 'graphql-tag';

export const getDigitalThemesQuery = gql`
  query themeOptions {
    themes {
      id
      name
      digital_preview_image_url
    }
  }
`;

export const getPrintThemesQuery = gql`
  query themeOptions {
    template_book_pairs {
      id
      preview_image_url
      template_book {
        id
        name
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
