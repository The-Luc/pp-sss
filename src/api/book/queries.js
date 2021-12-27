import { gql } from 'graphql-tag';

const sheetFragment = gql`
  fragment sheetDetail on Sheet {
    id
    sheet_type
    sheet_order
  }
`;

const sectionFragment = gql`
  fragment sectionDetail on BookSection {
    id
    name
    color
    section_order
    assigned_user {
      id
    }
    sheets {
      ...sheetDetail
    }
  }
  ${sheetFragment}
`;

const bookFragment = gql`
  fragment bookDetail on Book {
    id
    title
    total_pages
    book_sections {
      ...sectionDetail
    }
  }
  ${sectionFragment}
`;

export const digitalMainQuery = gql`
  query digitalMain($bookId: ID!) {
    book(id: $bookId) {
      book_sections {
        due_date
        status
        sheets {
          digital_frames {
            id
            preview_image_url
            frame_order
          }
        }
      }
      ...bookDetail
    }
  }
  ${bookFragment}
`;

// book: theme_id
// book / book_sections / sheets: theme_id
export const digitalEditorQuery = gql`
  query digitalEditor($bookId: ID!) {
    book(id: $bookId) {
      community_id
      book_user {
        id
        is_digital_photo_visited
      }
      digital_theme_id
      book_sections {
        sheets {
          is_visited
          digital_frames {
            id
            preview_image_url
            is_visited
            frame_order
          }
        }
      }
      ...bookDetail
    }
  }
  ${bookFragment}
`;

export const printMainQuery = gql`
  query printMain($bookId: ID!) {
    book(id: $bookId) {
      book_sections {
        due_date
        status
        sheets {
          id
          linked
          pages {
            id
            preview_image_url
          }
        }
      }
      ...bookDetail
    }
  }
  ${bookFragment}
`;

// book: theme_id, page_info
// book / book_sections / sheets: theme_id
export const printEditorQuery = gql`
  query printEditor($bookId: ID!) {
    book(id: $bookId) {
      community_id
      number_max_pages
      book_user {
        id
        is_print_photo_visited
      }
      yearbook_spec {
        cover_option
      }
      print_page_numbers
      print_theme_id
      page_number_position
      properties
      book_sections {
        sheets {
          id
          linked
          is_visited
          pages {
            id
            title
            preview_image_url
            show_page_number
          }
        }
      }
      ...bookDetail
    }
  }
  ${bookFragment}
`;

export const managerQuery = gql`
  query($bookId: ID!) {
    book(id: $bookId) {
      created_at
      number_max_pages
      yearbook_spec {
        cover_option
        delivery_option
        copies_sold
        fundraising_earned
        estimated_quantity_high
        estimated_quantity_low
        delivery_date
        phase_one_start_date
      }
      book_sections {
        draggable
        due_date
        status
        sheets {
          draggable
          fixed_position
        }
      }
      ...bookDetail
    }
  }
  ${bookFragment}
`;
