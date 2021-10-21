import { gql } from 'graphql-tag';

export const getMediaApi = gql`
  query($id: ID!, $terms: [String]) {
    search_community_assets(id: $id, terms: $terms) {
      id
      media_file_name
      thumbnail_uri
      media_url
      original_height
      original_width
      is_media
    }
  }
`;
