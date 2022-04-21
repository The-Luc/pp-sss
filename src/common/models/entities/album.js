import { BaseEntity } from '../base';

export class AlbumEntity extends BaseEntity {
  type = 'Album';
  name = '';
  displayDate = '';
  assets = []; // album photo are in this array

  /**
   * @param {AlbumEntity} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
