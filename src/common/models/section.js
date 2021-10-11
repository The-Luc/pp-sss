import { BaseEntity } from './base';
import { PROCESS_STATUS } from '@/common/constants';

export class SectionBase extends BaseEntity {
  name = '';
  assigneeId = null;
  color = '';
  dueDate = null;
  status = PROCESS_STATUS.NOT_STARTED.value;

  /**
   * @param {SectionDetail} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class SectionDetail extends SectionBase {
  fixed = false;
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
