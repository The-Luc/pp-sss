import { BaseEntity } from './base';
import { DEFAULT_COLOR, PROCESS_STATUS } from '@/common/constants';

export class SectionBase extends BaseEntity {
  name = '';
  assigneeId = null;
  color = DEFAULT_COLOR.COLOR;
  dueDate = null;
  status = PROCESS_STATUS.NOT_STARTED;

  /**
   * @param {SectionDetail} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class SectionDetail extends SectionBase {
  draggable = true;
  sheetIds = [];

  /**
   * @param {SectionDetail} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class SectionEditionDetail extends SectionBase {
  sheets = [];

  /**
   * @param {SectionEditionDetail} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
