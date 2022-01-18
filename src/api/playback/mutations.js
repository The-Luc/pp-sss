import gql from 'graphql-tag';

const transitionFragment = gql`
  fragment TransitionDetail on DigitalTransition {
    id
    direction
    transition_type
    duration
  }
`;

export const updateSingleTransitionMutation = gql`
  mutation updateSingleTransition($id: ID!, $params: DigitalTransitionInput) {
    update_digital_transition(
      digital_transition_id: $id
      digital_transition_params: $params
    ) {
      ...TransitionDetail
    }
  }
  ${transitionFragment}
`;

export const updateSheetTransitionMutation = gql`
  mutation updateSheetTransition($id: ID!, $params: DigitalTransitionInput) {
    update_digital_transitions_of_sheet(
      sheet_id: $id
      digital_transition_params: $params
    ) {
      ...TransitionDetail
    }
  }
  ${transitionFragment}
`;

export const updateSectionTransitionMutation = gql`
  mutation updateSectionTransition($id: ID!, $params: DigitalTransitionInput) {
    update_digital_transitions_of_book_section(
      book_section_id: $id
      digital_transition_params: $params
    ) {
      ...TransitionDetail
    }
  }
  ${transitionFragment}
`;

export const updateBookTransitionMutation = gql`
  mutation updateBookTransition($id: ID!, $params: DigitalTransitionInput) {
    update_digital_transitions_of_book(
      book_id: $id
      digital_transition_params: $params
    ) {
      ...TransitionDetail
    }
  }
  ${transitionFragment}
`;

export const updateSectionAnimationMutation = gql`
  mutation updateSectionAnimation(
    $id: ID!
    $params: DigitalFrameObjectAnimationInput!
    $objectType: ObjectType!
    $animationType: AnimationType!
  ) {
    update_animation_in_book_section(
      book_section_id: $id
      object_type: $objectType
      animation_type: $animationType
      setting_params: $params
    ) {
      id
      objects
    }
  }
`;

export const updateBookAnimationMutation = gql`
  mutation updateBookAnimation(
    $id: ID!
    $params: DigitalFrameObjectAnimationInput!
    $objectType: ObjectType!
    $animationType: AnimationType!
  ) {
    update_animation_in_book(
      book_id: $id
      object_type: $objectType
      animation_type: $animationType
      setting_params: $params
    ) {
      id
      objects
    }
  }
`;
