import { BaseObject, BaseEntity } from './base';

export class PageInfo extends BaseObject {
  isNumberingOn = false;
  position = '';
  fontFamily = '';
  fontSize = 0;
  color = '';

  /**
   * @param {PageInfo} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class BookBase extends BaseEntity {
  title = '';
  totalPages = 0;
  totalSheets = 0;
  totalScreens = 0;

  /**
   * @param {BookBase} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class BookPrintData extends BookBase {
  themeId = null;
  pageInfo = new PageInfo();

  /**
   * @param {BookPrintData} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class BookDigitalData extends BookBase {
  themeId = null;

  /**
   * @param {BookDigitalData} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class BookDetail extends BookBase {
  communityId = null;
  createdDate = null;
  deliveryDate = null;
  releaseDate = null;
  saleDate = null;
  coverOption = '';
  deliveryOption = '';
  numberMaxPages = 0;
  booksSold = 0;
  fundraisingEarned = 0;
  estimatedQuantity = {
    min: 0,
    max: 0
  };

  /**
   * @param {BookDetail} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
