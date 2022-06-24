import { gql } from 'graphql-tag';

export const saveDigitalConfigMutation = gql`
  mutation updateFrame(
    $frameId: ID!
    $frameParams: DigitalFrameInput
    $bookId: ID!
    $bookParams: BookInput
  ) {
    update_digital_frame(
      digital_frame_id: $frameId
      digital_frame_params: $frameParams
    ) {
      id
      title
      frame_delay
      is_visited
      frame_order
    }
    update_book(book_id: $bookId, book_params: $bookParams) {
      id
      digital_theme_id
    }
  }
`;

export const saveDigitalObjectsMuataion = gql`
  mutation updateFrame($frameId: ID!, $frameParams: DigitalFrameInput) {
    update_digital_frame(
      digital_frame_id: $frameId
      digital_frame_params: $frameParams
    ) {
      id
      objects
      preview_image_url
      play_in_ids
      play_out_ids
    }
  }
`;
