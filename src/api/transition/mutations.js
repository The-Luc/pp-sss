import gql from 'graphql-tag';

const transitionFragment = gql`
  fragment TransitionDetail on DigitalTransition {
    id
    direction
    transition_type
    duration
  }
`;

export const updateSingleTransition = gql`
  mutation updateSingleTransition($id: ID!, $params: DigitalTransitionInput) {
    update_digital_mutation(
      digital_transition_id: $id
      digital_transition_params: $params
    ) {
      ...TransitionDetail
    }
  }
  ${transitionFragment}
`;

export const updateSheetTransition = gql`
  mutation updateSingleTransition($id: ID!, $params: DigitalTransitionInput) {
    update_digital_mutation_of_sheet(
      sheet_id: $id
      digital_transition_params: $params
    ) {
      ...TransitionDetail
    }
  }
  ${transitionFragment}
`;
