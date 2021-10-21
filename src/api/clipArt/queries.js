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
