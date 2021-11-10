import { gql } from 'graphql-tag';

export const saveFavoritesMutation = gql`
  mutation($id: ID!) {
    create_template_user(template_id: $id) {
      id
    }
  }
`;
