import { gql } from 'graphql-tag';

export const addSectionQuery = gql`
  mutation($bookId: ID!, $params: BookSectionInput) {
    create_book_section(book_id: $bookId, book_section_params: $params) {
      id
      color
      name
      due_date
      draggable
      status
      sheets {
        id
      }
    }
  }
`;
export const updateSectionMutation = gql`
  mutation($sectionId: ID!, $params: BookSectionInput) {
    update_book_section(
      book_section_id: $sectionId
      book_section_params: $params
    ) {
      id
      color
      name
      due_date
      draggable
      status
      sheets {
        id
      }
    }
  }
`;

export const assignSectionUserMutation = gql`
  mutation($sectionId: ID!, $params: BookSectionInput) {
    update_book_section(
      book_section_id: $sectionId
      book_section_params: $params
    ) {
      assigned_user {
        name
        id
      }
    }
  }
`;
