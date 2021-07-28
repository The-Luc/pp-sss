import { DEFAULT_BACKGROUND, OBJECT_TYPE } from '@/common/constants';
import { BaseElementEntity } from './base';

export class BackgroundElementEntity extends BaseElementEntity {
  type = OBJECT_TYPE.BACKGROUND;
  backgroundId = ''; // to store the id of background on menu
  categoryId = '';
  backgroundType = DEFAULT_BACKGROUND.BACKGROUND_TYPE;
  pageType = DEFAULT_BACKGROUND.PAGE_TYPE;
  isLeftPage = DEFAULT_BACKGROUND.IS_LEFT;
  name = '';
  thumbnail = '';
  imageUrl = '';

  /**
   * @param {BackgroundElementEntity} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
