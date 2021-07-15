import { BaseObject } from './base';

export class DefaultLayout extends BaseObject {
  id = null;
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
