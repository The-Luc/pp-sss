import { BaseObject } from './base';

import {
  TRANSITION_DEFAULT,
  TRANS_DIRECTION_DEFAULT,
  TRANS_DURATION_DEFAULT
} from '../constants';

export class Transition extends BaseObject {
  transition = TRANSITION_DEFAULT.value;
  direction = TRANS_DIRECTION_DEFAULT.value;
  duration = TRANS_DURATION_DEFAULT;

  /**
   * @param {User} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
