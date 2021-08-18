import { DEFAULT_BACKGROUND, OBJECT_TYPE } from '@/common/constants';
import { BaseElementObject } from './base';

export class BackgroundElementObject extends BaseElementObject {
  type = OBJECT_TYPE.BACKGROUND;
  backgroundId = ''; // to store the id of background on menu
  categoryId = '';
  backgroundType = DEFAULT_BACKGROUND.BACKGROUND_TYPE;
  pageType = DEFAULT_BACKGROUND.PAGE_TYPE;
  isLeftPage = DEFAULT_BACKGROUND.IS_LEFT;
  imageUrl = '';

  /**
   * @param {BackgroundElementObject} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
