import { gql } from 'graphql-tag';
import { digitalTemplateFragment } from './queries';

export const saveUserLayoutMutation = gql`
  mutation saveUserLayout(
    $id: ID!
    $type: SaveTypesType!
    $title: String!
    $previewImageUrl: String!
    $layoutUse: TemplateLayoutUseType!
  ) {
    create_user_custom_print_template(
      id: $id
      save_type: $type
      title: $title
      preview_image_url: $previewImageUrl
      layout_use: $layoutUse
    ) {
      id
      title
      layout
      layout_type
      layout_use
      preview_image_url
    }
  }
`;

export const saveUserDigitalLayoutMutation = gql`
  mutation saveUserDigitalLayout(
    $frameSelections: [CustomDigitalFrameTemplateInput!]!
    $title: String!
    $isSupplemental: Boolean!
  ) {
    create_user_custom_digital_template(
      digital_frame_selections: $frameSelections
      title: $title
      is_supplemental: $isSupplemental
    ) {
      ...digitalTemplate
    }
  }
  ${digitalTemplateFragment}
`;
