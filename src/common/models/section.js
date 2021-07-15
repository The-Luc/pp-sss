import { BaseObject } from './base';

export class Section extends BaseObject {
  id = null;
  name = '';
  bookId = null;
  assigneeId = null;
  color = '';
  dueDate = null;
  status = 0;
  order = 0;
  draggable = false;

  /**
   * @param {Section} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
