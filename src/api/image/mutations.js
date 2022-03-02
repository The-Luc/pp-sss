import { gql } from 'graphql-tag';
import { imageStyleFragment } from './queries';

export const saveUserImageStylesMutation = gql`
  mutation saveUserImageStyle($params: ImageStyleInput) {
    create_image_style(params: $params) {
      ...imageStyle
    }
  }
  ${imageStyleFragment}
`;
