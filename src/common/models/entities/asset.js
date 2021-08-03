import { BaseElementEntity } from './elements';
import { OBJECT_TYPE } from '@/common/constants/objectType';
export class AssetEntity extends BaseElementEntity {
  type = '';
  mediaFileName = '';

  /**
   * @param {AssetEntity} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class PictureAssetEntity extends AssetEntity {
  type = OBJECT_TYPE.PICTURE;
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
