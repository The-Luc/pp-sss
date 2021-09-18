import {
  ANIMATION_DIR,
  DEFAULT_BACKGROUND,
  OBJECT_TYPE,
  PLAY_IN_STYLES
} from '@/common/constants';
import { BaseElementObject, BaseAnimation } from './base';

export class BackgroundElementObject extends BaseElementObject {
  type = OBJECT_TYPE.BACKGROUND;
  backgroundId = ''; // to store the id of background on menu
  categoryId = '';
  backgroundType = DEFAULT_BACKGROUND.BACKGROUND_TYPE;
  pageType = DEFAULT_BACKGROUND.PAGE_TYPE;
  isLeftPage = DEFAULT_BACKGROUND.IS_LEFT;
  imageUrl = '';
  animationIn = new BaseAnimation({
    style: PLAY_IN_STYLES.FADE_SLIDE_IN,
    direction: ANIMATION_DIR.LEFT_RIGHT,
    order: null
  });
  animationOut = new BaseAnimation({ order: null });

  /**
   * @param {BackgroundElementObject} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
