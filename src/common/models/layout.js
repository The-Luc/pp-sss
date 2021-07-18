import { BaseEntity } from './base';

export class DefaultLayout extends BaseEntity {
  themeId = null;
  name = '';
  type = '';
  isFavorites = false;
  previewImageUrl = '';

  /**
   * @param {DefaultLayout} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
