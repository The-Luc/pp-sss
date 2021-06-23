/**
 * The object structure that contains size info for using on canvas
 */
export class SizeObject {
  pdfWidth = 0;
  pdfHeight = 0;
  sheetWidth = 0;
  sheetHeight = 0;
  spineWidth = 0;
  safeMargin = 0;
  ratio = 0;
  bleedTop = 0;
  bleedBottom = 0;
  bleedLeft = 0;
  bleedRight = 0;
  pageWidth = 0;
  pageHeight = 0;

  constructor(props) {
    Object.keys(props).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        this[key] = props[key];
      }
    });
  }
}

/**
 * The object structure that contains size summary for using on canvas
 */
export class SizeSummary {
  inches = new SizeObject({});
  pixels = new SizeObject({});

  constructor(inches, pixels) {
    this.inches = new SizeObject(inches);
    this.pixels = new SizeObject(pixels);
  }
}
