import { BaseEntity } from './base';

export class SectionBase extends BaseEntity {
  name = '';
  assigneeId = null;
  color = '';

  /**
   * @param {SectionInfo} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class SectionInfo extends SectionBase {
  dueDate = null;
  status = 0;
  draggable = true;
  fixed = false;
  sheetIds = [];

  /**
   * @param {SectionInfo} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class SectionEditionInfo extends SectionBase {
  sheets = [];

  /**
   * @param {SectionEditionInfo} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
