import { gql } from 'graphql-tag';

export const getSheetFramesQuery = gql`
  query($sheetId: ID!) {
    sheet(id: $sheetId) {
      id
      digital_frames {
        id
        frame_delay
        from_layout
        objects
        title
        is_visited
        preview_image_url
      }
    }
  }
`;
