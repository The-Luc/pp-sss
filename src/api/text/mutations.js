import { gql } from 'graphql-tag';
import { textStyleFragment } from './queries';

export const saveUserTextStylesMutation = gql`
  mutation userTextStyle($params: TextStyleInput) {
    create_text_style(params: $params) {
      ...textStyle
    }
  }
  ${textStyleFragment}
`;
