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
    $frameId: ID!
    $mappingParams: [ElementMappingUidInput]!
  ) {
    create_bulk_template_element_mapping(
      template_id: $printId
      digital_frame_template_id: $frameId
      mapping_params: $mappingParams
    ) {
      ...templateMappingDetail
    }
  }
  ${templateMappingDetail}
`;

export const deleteTemplateElementMutation = gql`
  mutation deleteTemplateMapping($ids: [ID!]!) {
    delete_template_element_mappings(template_element_mapping_ids: $ids) {
      id
    }
  }
`;

export const updateMappingConfigMutation = gql`
  mutation updateMappingConfig(
    $bookId: ID!
    $params: ProjectMappingConfigurationInput!
  ) {
    update_project_mapping_configuration(
      book_id: $bookId
      mapping_params: $params
    ) {
      id
      mapping_type
      primary_mapping_format
      mapping_status
      enable_content_mapping
    }
  }
`;

export const createElementMappingMutation = gql`
  mutation createElementMapping($params: ElementMappingInput) {
    create_element_mapping(mapping_params: $params) {
      id
      print_element_uid
      digital_frame {
        id
      }
      digital_element_uid
      sheet {
        id
      }
      mapped
    }
  }
`;

export const createBulkElementMappingMutation = gql`
  mutation createBulkElementMapping(
    $sheetId: ID!
    $pageId: ID!
    $frameId: ID!
    $params: [ElementMappingUidInput]!
  ) {
    create_bulk_element_mapping(
      sheet_id: $sheetId
      page_id: $pageId
      digital_frame_id: $frameId
      mapping_params: $params
    ) {
      id
      print_element_uid
      digital_frame {
        id
      }
      digital_element_uid
      sheet {
        id
      }
      mapped
    }
  }
`;

export const deleteElementMappingMutation = gql`
  mutation deleteElementMapping($ids: [ID!]!) {
    delete_element_mappings(element_mapping_ids: $ids) {
      id
    }
  }
`;

export const updateSheetMappingConfigMutation = gql`
  mutation updateSheetMappingConfig($sheetId: ID!, $params: SheetInput) {
    update_sheet(sheet_id: $sheetId, sheet_params: $params) {
      id
      mapping_type
      mapping_status
    }
  }
`;

export const updateElementMappingMutation = gql`
  mutation updateElementMapping($id: ID!, $params: ElementMappingInput!) {
    update_element_mapping(mapping_id: $id, mapping_params: $params) {
      id
      print_element_uid
      digital_element_uid
    }
  }
`;
