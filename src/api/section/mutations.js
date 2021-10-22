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
