import { gql } from 'graphql-tag';

const frameFragment = gql`
  fragment FrameDetail on DigitalFrame {
    id
    title
    frame_delay
    objects
    preview_image_url
    from_layout
    is_visited
    play_in_ids
    play_out_ids
  }
`;

export const createFrameMutation = gql`
  mutation createFrame($sheetId: ID!, $frameParams: DigitalFrameInput) {
    create_digital_frame(
      sheet_id: $sheetId
      digital_frame_params: $frameParams
    ) {
      ...FrameDetail
    }
  }
  ${frameFragment}
`;

export const deleteFrameMutation = gql`
  mutation deleteFrame($frameId: ID!) {
    delete_digital_frame(digital_frame_id: $frameId) {
      id
      sheets {
        id
      }
    }
  }
`;

export const updateFrameMutation = gql`
  mutation updateFrame($frameId: ID!, $frameParams: DigitalFrameInput) {
    update_digital_frame(
      digital_frame_id: $frameId
      digital_frame_params: $frameParams
    ) {
      ...FrameDetail
    }
  }
  ${frameFragment}
`;
