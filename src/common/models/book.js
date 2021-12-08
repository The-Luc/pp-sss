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
  communityId = '';
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

// TODO: remove later
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

// TODO: remove later
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

// TODO: remove later
export class BookDetail extends BookBase {
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
  printData = new BookPrintData();
  digitalData = new BookDigitalData();

  /**
   * @param {BookDetail} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class BookManagerDetail extends BookBase {
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
   * @param {BookManagerDetail} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class BookEditionDetail extends BookBase {
  themeId = null;
  isPhotoVisited = false;
  bookUserId = null;

  /**
   * @param {BookEditionDetail} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class BookPrintDetail extends BookEditionDetail {
  pageInfo = new PageInfo();
  coverOption = '';
  numberMaxPages = 0;

  /**
   * @param {BookPrintDetail} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class BookDigitalDetail extends BookEditionDetail {
  /**
   * @param {BookDigitalDetail} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
