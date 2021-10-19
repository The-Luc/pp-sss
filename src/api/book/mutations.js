import { gql } from 'graphql-tag';

export const saveName = gql`
  mutation($id: ID!, $text: String) {
    saveName(id: $id, text: $text) {
      id
      text
    }
  }
`;
