import { BaseEntity } from './base';

export class User extends BaseEntity {
  name = null;
  role = null;
  assigneeId = null;

  /**
   * @param {User} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
