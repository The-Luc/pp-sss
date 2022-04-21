import { DEFAULT_FRAME_DELAY } from '@/common/constants';
import { BaseEntity } from '..';

export class FrameEntity extends BaseEntity {
  sheetId = '';
  layoutId = '';
  title = '';
  delay = DEFAULT_FRAME_DELAY;
  objects = [];
  playInIds = [];
  playOutIds = [];
  previewImageUrl = '';
  fromLayout = true;
  isVisited = false;

  /**
   * @param {FrameEntity} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
