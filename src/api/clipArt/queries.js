import { gql } from 'graphql-tag';

export const getClipartCategories = gql`
  query getClipartCategories {
    categories(item_type: CLIPART) {
      name
      id
    }
  }
`;

export const getClipArts = gql`
  query getClipArts($id: ID!) {
    category(id: $id) {
      id
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

export const searchClipArt = gql`
  query searchClipArt($keyword: String!) {
    category_keyword(keyword: $keyword) {
      id
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

export const searchClipArt = gql`
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
