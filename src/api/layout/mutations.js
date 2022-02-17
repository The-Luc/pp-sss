import { gql } from 'graphql-tag';

export const saveUserLayoutMutation = gql`
  mutation saveUserLayout($id: ID!, $type: SaveTypesType!) {
    create_user_custom_print_template(id: $id, save_type: $type) {
      id
      layout
      layout_type
      preview_image_url
    }
  }
`;
