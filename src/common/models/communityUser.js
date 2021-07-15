import { BaseObject } from './base';

export class CommunityUser extends BaseObject {
  id = null;
  fullName = '';
  avatarThumbUrl = '';

  /**
   * @param {CommunityUser} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
