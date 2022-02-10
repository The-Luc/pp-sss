import { gql } from 'graphql-tag';

export const themeOptionsQuery = gql`
  query themeOptions {
    themes {
      id
      name
      preview_image_url
      digital_preview_image_url
    }
  }
`;
