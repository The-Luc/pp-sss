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
            preview_image_url
          }
        }
      }
      ...bookDetail
    }
  }
  ${bookFragment}
`;

// book: theme_id, is_photo_visited
// book / book_sections / sheets: theme_id
export const digitalEditorQuery = gql`
  query digitalEditor($bookId: ID!) {
    book(id: $bookId) {
      community_id
      book_sections {
        sheets {
          is_visited
          digital_frames {
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

// book_sections / sheets: link
export const printMainQuery = gql`
  query printMain($bookId: ID!) {
    book(id: $bookId) {
      book_sections {
        due_date
        status
        sheets {
          id
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

// book: theme_id, is_photo_visited, page_info
// book / book_sections / sheets: theme_id, link
export const printEditorQuery = gql`
  query printEditor($bookId: ID!) {
    book(id: $bookId) {
      community_id
      number_max_pages
      yearbook_spec {
        cover_option
      }
      book_sections {
        sheets {
          id
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
