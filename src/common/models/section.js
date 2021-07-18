import { BaseObject } from './base';

export class Section extends BaseObject {
  name = '';
  assigneeId = null;
  color = '';
  dueDate = null;
  status = 0;
  draggable = true;
  sheetIds = [];
  fixed = false;

  /**
   * @param {Section} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
