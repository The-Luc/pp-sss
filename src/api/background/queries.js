import { gql } from 'graphql-tag';

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
        id
        image_url
        name
        thumbnail
        page_type
      }
    }
  }
`;

// for digital editor
export const digitalBackgroundQuery = gql`
  query background($id: ID!) {
    category(id: $id) {
      id
      backgrounds(page_type: DIGITAL) {
        id
        image_url
        name
        thumbnail
        page_type
      }
    }
  }
`;

export const backgroundOfThemeQuery = gql`
  query backgroundOfTheme($id: ID!) {
    theme(id: $id) {
      id
      templates {
        categories {
          backgrounds {
            id
            image_url
            name
            thumbnail
            page_type
          }
        }
      }
    }
  }
`;
