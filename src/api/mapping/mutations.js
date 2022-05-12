import { gql } from 'graphql-tag';

export const templateMappingDetail = gql`
  fragment templateMappingDetail on TemplateElementMappingType {
    id
    template {
      id
      title
    }
    digital_frame_template {
      id
      digital_template {
        id
        title
      }
    }
    digital_element_uid
    print_element_uid
  }
`;

export const createTemplateMappingMutation = gql`
  mutation bulkTemplate(
    $printId: ID!
    $digitalId: ID!
    $mappingParams: [ElementMappingUidInput]!
  ) {
    create_bulk_template_element_mapping(
      template_id: $printId
      digital_frame_template_id: $digitalId
      mapping_params: $mappingParams
    ) {
      ...templateMappingDetail
    }
  }
  ${templateMappingDetail}
`;
