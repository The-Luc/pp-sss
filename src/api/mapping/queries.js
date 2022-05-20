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
        mapping_type
        primary_mapping_format
        mapping_status
        enable_content_mapping
      }
    }
  }
`;
