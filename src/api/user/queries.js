import { gql } from 'graphql-tag';

export const getUserRoleQuery = gql`
  query($id: ID!) {
    communities_user(id: $id) {
      admin
    }
  }
`;
