import { gql } from 'graphql-tag';

const saveTextAct = gql`
  mutation($id: Int, $text: String, $locked: Boolean) {
    SaveTextActivity(id: $id, text: $text, locked: $locked) {
      id
    }
  }
`;

export const analistMutation = {
  saveTextAct
};
