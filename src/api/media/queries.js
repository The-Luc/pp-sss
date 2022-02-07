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
    in_project(project_id: $projectId, project_type: BOOK)
  }
`;

export const getMediaQuery = gql`
  query getMediaQuery($id: ID!, $terms: [String], $projectId: Int!) {
    search_community_assets(id: $id, terms: $terms) {
      ...assetData
    }
  }
  ${assetFragment}
`;

export const getAssetByIdQuery = gql`
  query getAssetByIdQuery($id: ID!, $projectId: Int!) {
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
      in_project(project_id: $projectId, project_type: BOOK)
    }
  }
`;

export const getAllAlbumsQuery = gql`
  query getAllAlbumsQuery($communityId: ID!, $projectId: Int!) {
    user_containers {
      ...albumDetail
    }
    community_containers(id: $communityId, media_type: "all") {
      ...albumDetail
    }
    community_group_assets(id: $communityId, media_type: "all", range: ALL) {
      id
      name
      containers {
        ...albumDetail
      }
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
