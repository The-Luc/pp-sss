import { gql } from 'graphql-tag';

export const portraitFolders = gql`
  query portraitFolders($id: ID!) {
    book(id: $id) {
      id
      community {
        portrait_collections {
          id
          name
          thumb_url
          assets_count
          portrait_subjects {
            first_name
            last_name
            full_name
            subject_type
            primary_portrait_image
          }
        }
      }
    }
  }
`;
