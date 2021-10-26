import { gql } from 'graphql-tag';

export const getUserRoleQuery = gql`
  query($id: ID!) {
    communities_user(id: $id) {
      admin
    }
  }
`;

export const getCommunityUsersQuery = gql`
  query($communityId: ID!) {
    community(id: $communityId) {
      communities_users {
        admin
        user {
          name
          id
        }
      }
    }
  }
`;
