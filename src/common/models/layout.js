import { BaseEntity } from './base';

export class Layout extends BaseEntity {
  themeId = null;
  name = '';
  type = '';
  isFavorites = false;
  previewImageUrl = '';

  /**
   * @param {Layout} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
