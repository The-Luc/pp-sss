export class BaseObject {
  id = null;

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
        if (Object.prototype.hasOwnProperty.call(this, key)) {
          this[key] = props[key];
        }
      });
    }
  }
}
