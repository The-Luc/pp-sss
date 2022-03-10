import { gql } from 'graphql-tag';
import { albumDetailFragment } from './queries';

export const updateAlbumAssetsMutation = gql`
  mutation updateAlbumAssets($containerId: ID!, $assets: [AssetInput]) {
    update_container_assets(container_id: $containerId, assets: $assets) {
      ...albumDetail
    }
  }
  ${albumDetailFragment}
`;

export const createAlbumAssetsMutation = gql`
  mutation createAlbumAssets($params: ContainerInput) {
    create_container(container_params: $params) {
      ...albumDetail
    }
  }
  ${albumDetailFragment}
`;
