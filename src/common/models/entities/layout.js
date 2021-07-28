import { LAYOUT_PAGE_TYPE } from '@/common/constants';
import { BaseEntity } from '../base';

export class LayoutEntity extends BaseEntity {
  themeId = null;
  name = '';
  type = '';
  isFavorites = false;
  previewImageUrl = '';

  /**
   * @param {LayoutEntity} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class LayoutPrintEntity extends LayoutEntity {
  objects = [];
  pageType = LAYOUT_PAGE_TYPE.FULL_PAGE;

  /**
   * @param {LayoutPrintEntity} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class LayoutDigitalEntity extends LayoutEntity {
  frames = [];

  /**
   * @param {LayoutDigitalEntity} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}