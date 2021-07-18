import { BaseObject } from './base';

export class Section extends BaseObject {
  name = '';
  assigneeId = null;
  color = '';
  dueDate = null;
  status = 0;
  draggable = false;
  sheetIds = [];

  /**
   * @param {Section} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
