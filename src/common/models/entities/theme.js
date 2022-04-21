import { BaseEntity } from '../base';

export class ThemeEntity extends BaseEntity {
  name = '';
  previewImageUrl = '';

  /**
   * @param {LayoutDigitalEntity} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
