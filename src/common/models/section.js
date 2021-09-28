import { BaseEntity } from './base';

export class SectionBase extends BaseEntity {
  name = '';
  assigneeId = null;
  color = '';

  /**
   * @param {SectionDetail} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class SectionDetail extends SectionBase {
  dueDate = null;
  status = 0;
  draggable = true;
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
