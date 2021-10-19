import { gql } from 'graphql-tag';

export const saveTextAct = gql`
  mutation($id: ID!, $text: String) {
    saveName(id: $id, text: $text) {
      id
      text
    }
  }
`;
