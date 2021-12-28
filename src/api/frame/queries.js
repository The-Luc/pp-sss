import { gql } from 'graphql-tag';

export const getSheetFramesQuery = gql`
  query getSheetFrames($sheetId: ID!) {
    sheet(id: $sheetId) {
      id
      digital_frames {
        id
        frame_delay
        frame_order
        from_layout
        objects
        title
        is_visited
        preview_image_url
        play_in_ids
        play_out_ids
      }
      digital_transitions {
        id
        duration
        direction
        transition_order
        transition_type
      }
    }
  }
`;

export const getFrameObjectQuery = gql`
  query getFrameObject($frameId: ID!) {
    digital_frame(id: $frameId) {
      id
      objects
    }
  }
`;
