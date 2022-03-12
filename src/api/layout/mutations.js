import { gql } from 'graphql-tag';

export const saveUserLayoutMutation = gql`
  mutation saveUserLayout(
    $id: ID!
    $type: SaveTypesType!
    $title: String!
    $previewImageUrl: String
  ) {
    create_user_custom_print_template(
      id: $id
      save_type: $type
      title: $title
      preview_image_url: $previewImageUrl
    ) {
      id
      title
      layout
      layout_type
      preview_image_url
    }
  }
`;
