import { gql } from 'graphql-tag';

export const getUserRoleQuery = gql`
  query getUserRole($id: ID!) {
    communities_user(id: $id) {
      id
      admin
    }
  }
`;

export const getCommunityUsersQuery = gql`
  query getCommunityUsers($communityId: ID!) {
    community(id: $communityId) {
      id
      communities_users {
        id
        admin
        user {
          name
          id
        }
      }
    }
  }
`;

export const getFavoriteIdsQuery = gql`
  query getFavorites {
    template_favourites {
      id
    }
  }
`;

export const getFavoriteLayoutsQuery = gql`
  query getFavorites {
    template_favourites {
      id
      categories {
        id
      }
      preview_image_url
      data
    }
  }
`;
