import { BaseEntity, BaseObject } from '../base';

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

export class BookPrintData extends BaseObject {
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

export class BookDigitalData extends BaseObject {
  themeId = null;

  /**
   * @param {BookDigitalData} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class BookQuantity extends BaseObject {
  min = 0;
  max = 0;

  /**
   * @param {BookQuantity} props
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}

export class BookDetailEntity extends BaseEntity {
  communityId = null;
  title = '';
  totalPages = 0;
  totalSheets = 0;
  totalScreens = 0;
  createdDate = null;
  deliveryDate = null;
  releaseDate = null;
  saleDate = null;
  coverOption = '';
  deliveryOption = '';
  numberMaxPages = 0;
  booksSold = 0;
  fundraisingEarned = 0;
  estimatedQuantity = new BookQuantity();
  printData = new BookPrintData();
  digitalData = new BookDigitalData();
  sections = [];

  /**
   * @param {BookDetailEntity} props - object props to construct new instance of this class
   */
  constructor(props) {
    super(props);
    this._set(props);
  }
}
