import { BaseEntity } from './base';
import { DEFAULT_COLOR, PROCESS_STATUS } from '@/common/constants';

export class SectionBase extends BaseEntity {
  name = '';
  assigneeId = null;
  color = DEFAULT_COLOR.COLOR;
  dueDate = null;
  draggable = true;
  status = PROCESS_STATUS.NOT_STARTED;
  sheetIds = [];

  /**
   * @param {SectionBase} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
