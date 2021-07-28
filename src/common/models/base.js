export class BaseObject {
  /**
   * @param {BaseObject} props - object props to construct new instance of this class
   */
  constructor(props) {
    this._set(props);
  }

  /**
   * Set all object instance's attribute that match key of props
   * @param {BaseObject} props - object props
   */
  _set(props) {
    if (typeof props === 'object') {
      Object.keys(props).forEach(key => {
        this._setAttribute(key, props[key]);
      });
    }
  }

  /**
   * Set a single attribute of object
   * @param {String} att - a single attribute to be update
   * @param {Any} data - data to set to object's attribute
   */
  _setAttribute(att, data) {
    if (!Object.prototype.hasOwnProperty.call(this, att)) return;

    if (
      this[att] !== null &&
      typeof this[att] === 'object' &&
      typeof data === 'object' &&
      typeof this[att]._set === 'function'
    ) {
      this[att]._set(data);
    } else {
      this[att] = data;
    }
  }
}

export class BaseEntity extends BaseObject {
  id = null;

  /**
   * @param {BaseEntity} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
