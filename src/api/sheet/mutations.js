import { gql } from 'graphql-tag';

export const addSheetMutation = gql`
  mutation($sectionId: ID!, $params: SheetInput) {
    create_sheet(book_section_id: $sectionId, sheet_params: $params) {
      id
      draggable
      is_visited
      sheet_type
      fixed_position
      order
    }
  }
`;
