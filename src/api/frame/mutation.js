import { gql } from 'graphql-tag';

export const createFrameMutation = gql`
  mutation createFrame($sheetId: ID!, $frameParams: DigitalFrameInput) {
    create_digital_frame(
      sheet_id: $sheetId
      digital_frame_params: $frameParams
    ) {
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
  }
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

export const updateFrameOrder = gql`
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
