import { gql } from 'graphql-tag';

export const saveSettingMutation = gql`
  mutation($bookId: ID!, $params: PortraitLayoutSettingInput) {
    create_portrait_layout_setting(
      book_id: $bookId
      portrait_layout_setting_params: $params
    ) {
      name
    }
  }
`;
