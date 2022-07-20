import { gql } from 'graphql-tag';

export const frameFragment = gql`
  fragment FrameDetail on DigitalFrame {
    id
    title
    frame_delay
    frame_order
    objects
    preview_image_url
    from_layout
    is_visited
    play_in_ids
    play_out_ids
    sheets {
      id
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
    }
  }
`;

export const updateFrameOrderMutation = gql`
  mutation updateFrameOrder($sheetId: ID!, $frameOrderIds: [Int]) {
    update_digital_frame_order(
      sheet_id: $sheetId
      digital_frame_order_ids: $frameOrderIds
    ) {
      frame_order
      id
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
