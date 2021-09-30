import { DEFAULT_FRAME_DELAY } from '@/common/constants';
import { BaseObject } from '.';

export class FrameDetail extends BaseObject {
  title = '';
  delay = DEFAULT_FRAME_DELAY;
  objects = [];
  playInIds = [];
  playOutIds = [];
  previewImageUrl = '';
  fromLayout = true;
  isVisited = false;

  /**
   * @param {FrameDetail} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
