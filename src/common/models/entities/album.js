import { BaseElementEntity } from './elements';

export class AlbumEntity extends BaseElementEntity {
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
