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
  query getMediaApi($id: ID!, $terms: [String]) {
    search_community_assets(id: $id, terms: $terms) {
      ...assetData
    }
  }
  ${assetFragment}
`;

export const getAssetByIdQuery = gql`
  query getMediaApi($id: ID!) {
    asset(id: $id) {
      ...assetData
    }
  }
  ${assetFragment}
`;

const albumDetailFragment = gql`
  fragment albumDetail on Container {
    id
    title
    created_at
    assets {
      id
      thumbnail_uri
    }
  }
`;

export const getAllAlbumsQuery = gql`
  query getAllAlbumsQuery($communityId: ID!, $mediaType: String) {
    user_containers(media_type: $mediaType) {
      ...albumDetail
    }
    community_containers(id: $communityId, media_type: $mediaType) {
      ...albumDetail
    }
    community_group_assets(id: $communityId, range: ALL) {
      id
      name
      containers {
        ...albumDetail
      }
    }
  }
  ${albumDetailFragment}
`;
