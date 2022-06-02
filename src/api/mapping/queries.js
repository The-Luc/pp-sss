import { gql } from 'graphql-tag';
import { templateFragment } from '../layout/queries';

export const getMappingTemplateQuery = gql`
  query getMappingTemplate($id: ID!) {
    template(id: $id) {
      ...templateDetail
    }
  }
  ${templateFragment}
`;

export const getMappingSettingsQuery = gql`
  query getMappingSettings($bookId: ID!) {
    book(id: $bookId) {
      id
      project_mapping_configuration {
        id
        primary_mapping_format
        enable_content_mapping
      }
    }
  }
`;

export const getSheetMappingConfigQuery = gql`
  query getSheetMappingConfigQuery($id: ID!) {
    sheet(id: $id) {
      id
      mapping_type
      mapping_status
    }
  }
`;

export const elementMappingDetail = gql`
  fragment elementMappingDetail on ElementMappingType {
    id
    digital_frame {
      id
    }
    page {
      id
    }
    digital_element_uid
    print_element_uid
  }
`;
export const getSheetMappingElementsQuery = gql`
  query getSheetMappingElements($sheetId: ID!) {
    sheet(id: $sheetId) {
      id
      element_mappings {
        ...elementMappingDetail
      }
    }
  }
  ${elementMappingDetail}
`;
