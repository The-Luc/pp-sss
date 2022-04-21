import { gql } from 'graphql-tag';

export const updateBookMutation = gql`
  mutation($bookId: ID!, $params: BookInput) {
    update_book(book_id: $bookId, book_params: $params) {
      id
      print_page_numbers
      page_number_position
      print_theme_id
      digital_theme_id
    }
  }
`;

export const setPhotoIsVisitedMutation = gql`
  mutation($id: ID!, $params: BooksUserInput) {
    update_books_user(books_user_id: $id, books_user_params: $params) {
      id
      is_print_photo_visited
      is_digital_photo_visited
    }
  }
`;
