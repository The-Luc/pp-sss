import { gql } from 'graphql-tag';

export const backgroundCategoriesQuery = gql`
  {
    categories(item_type: BACKGROUND) {
      id
      name
    }
  }
`;

export const backgroundQuery = gql`
  query($id: ID!) {
    category(id: $id) {
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

export const backgroundOfThemeQuery = gql`
  query($id: ID!) {
    theme(id: $id) {
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
