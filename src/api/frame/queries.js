import { gql } from 'graphql-tag';
import { frameFragment } from './mutation';

export const digitalSheetFragment = gql`
  fragment SheetInfo on Sheet {
    id
    digital_frames {
      ...FrameDetail
    }
    digital_transitions {
      id
      duration
      direction
      transition_order
      transition_type
    }
  }
  ${frameFragment}
`;

export const getSheetFramesQuery = gql`
  query getSheetFrames($sheetId: ID!) {
    sheet(id: $sheetId) {
      ...SheetInfo
    }
  }
  ${digitalSheetFragment}
`;

export const getFrameObjectQuery = gql`
  query getFrameObject($frameId: ID!) {
    digital_frame(id: $frameId) {
      id
      objects
    }
  }
`;
