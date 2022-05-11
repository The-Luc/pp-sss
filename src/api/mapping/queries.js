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
