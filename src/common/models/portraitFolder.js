import { CLASS_ROLE } from '../constants';
import { BaseEntity } from './base';

export class PortraitFolder extends BaseEntity {
  name = '';
  thumbUrl = '';
  assetsCount = 0;
  assets = [];
  isSelected = false;

  /**
   * @param {PortraitFolder} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class PortraitAsset extends BaseEntity {
  firstName = '';
  lastName = '';
  thumbUrl = '';
  imageUrl = '';
  originalWidth = 640; // default base on data
  originalHeight = 800; // default base on data
  classRole = CLASS_ROLE.STUDENT;

  /**
   * @param {PortraitAsset} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
