import { gql } from 'graphql-tag';
const assetFragment = gql`
  fragment assetData on Asset {
    id
    media_file_name
    thumbnail_uri
    media_url
    original_height
    original_width
    is_media
  }
`;

export const getMediaQuery = gql`
  query getMediaQuery($id: ID!, $terms: [String]) {
    search_community_assets(id: $id, terms: $terms) {
      ...assetData
    }
  }
  ${assetFragment}
`;

export const getAssetByIdQuery = gql`
  query getAssetByIdQuery($id: ID!) {
    asset(id: $id) {
      ...assetData
    }
  }
  ${assetFragment}
`;

const albumDetailFragment = gql`
  fragment albumDetail on Container {
    id
    body
    created_at
    assets {
      id
      thumbnail_uri
      is_media
    }
  }
`;
const albumCategoryFragment = gql`
  fragment albumCategory on Container {
    id
    body
  }
`;

export const getAlbumCategoryQuery = gql`
  query getAlbumCategoryQuery($communityId: ID!) {
    user_containers {
      ...albumCategory
    }
    community_containers(id: $communityId, media_type: "all", per_page: 99999) {
      ...albumCategory
    }
    community_group_assets(id: $communityId, media_type: "all", range: ALL) {
      id
      name
      containers {
        ...albumCategory
      }
    }
  }
  ${albumCategoryFragment}
`;

export const getUserAlbumsQuery = gql`
  query getUserAlbumsQuery {
    user_containers {
      ...albumDetail
    }
  }
  ${albumDetailFragment}
`;

export const getAlbumByIdQuery = gql`
  query getAlbumById($id: ID!) {
    container(id: $id) {
      ...albumDetail
    }
  }
  ${albumDetailFragment}
`;

export const getQrrentByIdQuery = gql`
  query getQrrentById($id: ID!) {
    qrrent(id: $id) {
      id
      name
      containers {
        ...albumDetail
      }
    }
  }
  ${albumDetailFragment}
`;

export const getCommunityAlbumsQuery = gql`
  query getCommunityAlbums($communityId: ID!, $page: Int!) {
    community_containers(
      id: $communityId
      media_type: "all"
      page: $page
      per_page: 10
    ) {
      ...albumDetail
    }
  }
  ${albumDetailFragment}
`;

export const getInProjectAssetsQuery = gql`
  query getInProjectAssets(
    $bookId: ID!
    $projectId: Int!
    $type: ProjectTypesType!
  ) {
    book(id: $bookId) {
      id
      in_project_assets {
        id
        in_project(project_id: $projectId, project_type: $type)
      }
    }
  }
`;
