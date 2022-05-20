import { gql } from 'graphql-tag';
import { templateMappingDetail } from '../mapping/mutations';

const communityUserFragment = gql`
  fragment communityUserDetail on CommunitiesUser {
    id
    admin
    user {
      name
      id
    }
  }
`;

export const getUserRoleQuery = gql`
  query getUserRole($id: ID!) {
    communities_user(id: $id) {
      ...communityUserDetail
    }
  }
  ${communityUserFragment}
`;

export const getCommunityUsersQuery = gql`
  query getCommunityUsers($communityId: ID!) {
    community(id: $communityId) {
      id
      communities_users {
        ...communityUserDetail
      }
    }
  }
  ${communityUserFragment}
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
      title
      preview_image_url
      data
      layout_type
      template_element_mappings {
        ...templateMappingDetail
      }
    }
  }
  ${templateMappingDetail}
`;
