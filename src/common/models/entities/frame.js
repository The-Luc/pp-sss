import { BaseElementEntity } from './elements';

export class FrameEntity extends BaseElementEntity {
  sheetId = '';
  layoutId = '';
  title = '';
  delay = 0;
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
