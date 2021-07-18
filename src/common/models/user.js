import { BaseObject } from './base';

export class User extends BaseObject {
  name = null;
  role = null;

  /**
   * @param {User} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
