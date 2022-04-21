import { ASSET_TYPE } from '@/common/constants';
import { BaseEntity } from '../base';

export class AssetEntity extends BaseEntity {
  type = '';
  mediaFileName = '';
  inProject = false;

  /**
   * @param {AssetEntity} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class PictureAssetEntity extends AssetEntity {
  type = ASSET_TYPE.PICTURE;
  originalHeight = 0;
  originalWidth = 0;
  thumbUrl = '';
  imageUrl = '';

  /**
   * @param {PictureAssetEntity} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class VideoAssetEntity extends AssetEntity {
  type = ASSET_TYPE.VIDEO;
  originalHeight = 0;
  originalWidth = 0;
  thumbUrl = '';
  mediaUrl = '';
  duration = 0;

  /**
   * @param {VideoAssetEntity} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
