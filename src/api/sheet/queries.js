import { gql } from 'graphql-tag';

export const pageInfoQuery = gql`
  query($id: ID!) {
    page(id: $id) {
      layout
    }
  }
`;
