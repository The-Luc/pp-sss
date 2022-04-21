import gql from 'graphql-tag';

export const uploadBase64ImageMutation = gql`
  mutation uploadBase64Image($base64: String) {
    upload_base64_image(base64: $base64)
  }
`;

export const savePresetColorPickerMutation = gql`
  mutation savePresetColorPickerMutation($colors: [String]!) {
    update_user_favourite_colors(colors: $colors)
  }
`;
