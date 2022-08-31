import { gql } from 'graphql-tag';

const backgroundFragment = gql`
  fragment backgroundDetail on Background {
    id
    image_url
    name
    thumbnail
    page_type
  }
`;

export const backgroundCategoriesQuery = gql`
  query backgroundCategories {
    categories(item_type: BACKGROUND) {
      id
      name
    }
  }
`;

export const backgroundQuery = gql`
  query background($id: ID!) {
    category(id: $id) {
      id
      backgrounds {
        ...backgroundDetail
      }
    }
  }
  ${backgroundFragment}
`;

// for digital editor
export const digitalBackgroundQuery = gql`
  query background($id: ID!) {
    category(id: $id) {
      id
      backgrounds(page_type: DIGITAL) {
        ...backgroundDetail
      }
    }
  }
  ${backgroundFragment}
`;

export const backgroundOfThemeQuery = gql`
  query backgroundOfTheme($id: ID!) {
    template_book_pair(id: $id) {
      id
      template_book {
        id
        print_template_backgrounds {
          ...backgroundDetail
        }
      }
      spread_template_book {
        id
        print_template_backgrounds {
          ...backgroundDetail
        }
      }
    }
  }
  ${backgroundFragment}
`;

export const digitalBackgroundByThemeQuery = gql`
  query digitalBackgroundByTheme {
    themes {
      id
      digital_templates {
        id
        title
        backgrounds {
          ...backgroundDetail
        }
      }
    }
  }
  ${backgroundFragment}
`;
