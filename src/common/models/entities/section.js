import { BaseEntity } from '../base';

export class SectionEntity extends BaseEntity {
  name = '';
  bookId = null;
  draggable = false;
  assigneeId = null;
  color = '';
  dueDate = null;
  status = 0;
  order = 0;
  sheets = [];

  /**
   * @param {SectionEntity} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
