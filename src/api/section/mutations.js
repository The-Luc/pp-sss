import { gql } from 'graphql-tag';

const sectionFragment = gql`
  fragment sectionInfo on BookSection {
    id
    color
    name
    due_date
    draggable
    status
    section_order
    sheets {
      id
    }
    assigned_user {
      name
      id
    }
  }
`;

export const addSectionMutation = gql`
  mutation addSection(
    $bookId: ID!
    $params: BookSectionInput
    $lastSectionId: ID!
    $lastSectionParams: BookSectionInput
  ) {
    create_book_section(book_id: $bookId, book_section_params: $params) {
      ...sectionInfo
    }
    update_book_section(
      book_section_id: $lastSectionId
      book_section_params: $lastSectionParams
    ) {
      id
      section_order
    }
  }
  ${sectionFragment}
`;

export const updateSectionMutation = gql`
  mutation updateSection($sectionId: ID!, $params: BookSectionInput) {
    update_book_section(
      book_section_id: $sectionId
      book_section_params: $params
    ) {
      ...sectionInfo
    }
  }
  ${sectionFragment}
`;

export const updateSectionOrderMutation = gql`
  mutation updateBookSectionOrder($bookId: ID!, $sectionIds: [Int]) {
    update_book_section_order(
      book_id: $bookId
      book_section_order_ids: $sectionIds
    ) {
      id
      section_order
    }
  }
`;

export const deleteSectionMutation = gql`
  mutation deleteSection($sectionId: ID!, $bookId: ID!, $sectionIds: [Int]) {
    delete_book_section(book_section_id: $sectionId) {
      id
      book {
        id
      }
    }
    update_book_section_order(
      book_id: $bookId
      book_section_order_ids: $sectionIds
    ) {
      id
      section_order
    }
  }
`;
