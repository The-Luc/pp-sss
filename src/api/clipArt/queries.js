import { gql } from 'graphql-tag';

export const getClipartCategories = gql`
  {
    categories(item_type: CLIPART) {
      name
      id
    }
  }
`;

export const getClipArts = gql`
  query($id: ID!) {
    category(id: $id) {
      cliparts {
        id
        name
        category
        thumbnail
        vector
      }
    }
  }
`;

export const searchClipArts = gql`
  query($keyword: String!) {
    category_keyword(keyword: $keyword) {
      cliparts {
        id
        name
        category
        thumbnail
        vector
      }
    }
  }
`;
