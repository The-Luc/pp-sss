import {
  getPagePrintSize,
  inToPx,
  isEmpty,
  pxToIn,
  pxToPt
} from '@/common/utils';
import {
  imageBorderModifier,
  useDoubleStroke,
  useOverrides
} from '@/plugins/fabric';
import { fabric } from 'fabric';
import { usePageApi } from './composables';
import { OBJECT_TYPE, SYSTEM_OBJECT_TYPE } from '@/common/constants';
import {
  applyBorderToImageObject,
  applyShadowToObject,
  createBackgroundFabricObject,
  createImage,
  createPortraitImage,
  createTextBox,
  handleGetSvgData,
  updateSpecificProp
} from '@/common/fabricObjects';
import { first, get } from 'lodash';
import {
  BackgroundElementObject,
  ClipArtElementObject,
  ImageElementObject,
  TextElementObject
} from '@/common/models/element';

export default {
  setup() {
    const { getPageData } = usePageApi();
    return {
      getPageData
    };
  },
  data() {
    return {
      containerSize: null,
      canvasSize: null,
      pageSize: null,
      canvas: null,
      rulerSize: { width: '0', height: '0' },
      isScroll: { x: false, y: false }
    };
  },
  methods: {
    /**
     * Event triggered once the container that hold the canvas is finished rendering
     * @param {Object} containerSize - the size object
     */
    createCanvas() {
      const el = this.$refs.canvas;
      this.canvas = window.canvas = new fabric.Canvas(el, {
        backgroundColor: '#fff',
        preserveObjectStacking: true
      });
      useOverrides(fabric.Object.prototype);
      this.updateCanvasSize();
    },

    /**
     * Auto resize canvas to fit the container size
     */
    updateCanvasSize() {
      const pageSize = getPagePrintSize();
      const {
        sheetWidth,
        sheetHeight,
        bleedLeft,
        bleedRight
      } = pageSize.pixels;
      const pageWidth = (sheetWidth + bleedLeft + bleedRight) * 0.5;

      const height = sheetHeight * this.zoom;
      const width = pageWidth * this.zoom;

      this.canvas.setWidth(width);
      this.canvas.setHeight(height);

      this.canvas.setZoom(this.zoom);
    },

    /**
     * Create and render objects on the canvas
     *
     * @param {Object} objects ppObjects that will be rendered
     */
    async drawObjectsOnCanvas(objects) {
      if (isEmpty(objects)) return;

      const allObjectPromises = objects.map(objectData => {
        if (
          objectData.type === OBJECT_TYPE.SHAPE ||
          objectData.type === OBJECT_TYPE.CLIP_ART
        ) {
          return this.createSvgFromPpData(objectData);
        }

        if (objectData.type === OBJECT_TYPE.TEXT) {
          return this.createTextFromPpData(objectData);
        }

        if (objectData.type === OBJECT_TYPE.IMAGE) {
          return this.createImageFromPpData(objectData);
        }

        if (objectData.type === OBJECT_TYPE.PORTRAIT_IMAGE) {
          return this.createPortraitImageFromPpData(objectData);
        }

        if (objectData.type === OBJECT_TYPE.BACKGROUND) {
          return this.createBackgroundFromPpData(objectData);
        }
      });

      const listFabricObjects = await Promise.all(allObjectPromises);

      this.canvas.add(...listFabricObjects);
      this.canvas.requestRenderAll();
      this.dispatchLoadedEvent();
    },

    /**
     * add shape/ clipart to the store and create fabric object
     *
     * @param {Object} objectData PpData of the of a shape object {id, size, coord,...}
     * @returns {Object} a fabric object
     */
    async createSvgFromPpData(objectData) {
      const {
        id,
        type,
        size: { width: expectedWidth, height: expectedHeight }
      } = objectData;
      const svg = {
        id: id,
        object: objectData
      };

      const svgUrlAttrName =
        type === OBJECT_TYPE.CLIP_ART ? 'vector' : 'pathData';

      const object = await handleGetSvgData({
        svg,
        svgUrlAttrName,
        expectedHeight,
        expectedWidth
      });

      const {
        dropShadow,
        shadowBlur,
        shadowOffset,
        shadowOpacity,
        shadowAngle,
        shadowColor
      } = object;

      applyShadowToObject(object, {
        dropShadow,
        shadowBlur,
        shadowOffset,
        shadowOpacity,
        shadowAngle,
        shadowColor
      });

      return object;
    },

    /**
     * create fabric object
     *
     * @param {Object} textProperties PpData of the of a text object {id, size, coord,...}
     * @returns {Object} a fabric object
     */
    createTextFromPpData(textProperties) {
      const {
        coord,
        size: { height, width }
      } = textProperties;

      const { object, data: objectData } = createTextBox(
        inToPx(coord.x),
        inToPx(coord.y),
        inToPx(width),
        inToPx(height),
        textProperties
      );

      const {
        newObject: {
          shadow,
          coord: { rotation }
        }
      } = objectData;

      updateSpecificProp(object, {
        coord: {
          rotation
        }
      });

      const objects = object.getObjects();

      objects.forEach(obj => {
        applyShadowToObject(obj, shadow);
      });

      return object;
    },

    /**
     * add image to the store and create fabric object
     *
     * @param {Object} imageProperties PpData of the of an image object {id, size, coord,...}
     * @returns {Object} a fabric object
     */
    async createImageFromPpData(imageProperties) {
      const imageObject = await createImage(imageProperties);
      const image = imageObject?.object;

      const { border } = imageProperties;

      imageBorderModifier(image);

      const {
        dropShadow,
        shadowBlur,
        shadowOffset,
        shadowOpacity,
        shadowAngle,
        shadowColor
      } = image;

      applyShadowToObject(image, {
        dropShadow,
        shadowBlur,
        shadowOffset,
        shadowOpacity,
        shadowAngle,
        shadowColor
      });

      applyBorderToImageObject(image, border);

      return image;
    },

    /**
     * create fabric object
     *
     * @param {Object} properties PpData of the of a background object {id, size, coord,...}
     * @returns {Object} a fabric objec
     */
    async createPortraitImageFromPpData(properties) {
      const image = await createPortraitImage(properties);

      const { border, shadow } = properties;

      useDoubleStroke(image);

      applyShadowToObject(image, shadow);

      applyBorderToImageObject(image, border);

      return image;
    },

    /**
     * create fabric object
     *
     * @param {Object} backgroundProp PpData of the of a background object {id, size, coord,...}
     * @returns {Object} a fabric objec
     */
    async createBackgroundFromPpData(backgroundProp) {
      return createBackgroundFabricObject(backgroundProp, this.canvas);
    },

    /**
     * Dispach event when page loaded
     */
    dispatchLoadedEvent() {
      const event = new CustomEvent('pdf-page-loaded', {
        detail: {
          message: 'PDF Page Loaded',
          time: new Date()
        },
        bubbles: true,
        cancelable: true
      });
      document.body.dispatchEvent(event);
    },

    /**
     * Create page objecs from backend data
     * @param {Array} elements backend data
     * @returns list page objects will be rendered to canvas
     */
    createElementsFromPpData(elements) {
      const mapType = {
        [SYSTEM_OBJECT_TYPE.TEXT]: OBJECT_TYPE.TEXT,
        [SYSTEM_OBJECT_TYPE.CLIP_ART]: OBJECT_TYPE.CLIP_ART,
        [SYSTEM_OBJECT_TYPE.IMAGE]: OBJECT_TYPE.IMAGE
      };
      return elements.map(ele => {
        const key = first(Object.keys(ele));
        const value = ele[key];

        const { size, opacity, coord } = this.getElementDimension(value);

        if (key === SYSTEM_OBJECT_TYPE.TEXT) {
          const textElement = this.createTextElement(value);
          textElement.update({ opacity, size, coord });
          return textElement;
        }

        if (key === SYSTEM_OBJECT_TYPE.IMAGE) {
          const imageElement = this.createImageElement(value);
          imageElement.update({ opacity, size, coord });
          return imageElement;
        }

        if (key === SYSTEM_OBJECT_TYPE.CLIP_ART) {
          const clipartElement = this.createClipartElement(value);
          clipartElement.update({ opacity, size, coord });
          return clipartElement;
        }

        return {
          type: mapType[key],
          size,
          coord,
          selectable: false
        };
      });
    },

    /**
     * Create text element from backend data
     * @param {Obejct} element backend element
     * @returns parallel object data
     */
    createTextElement(element) {
      const text = get(element, 'text.properties.text', '');
      const { font_size, text_aligment: alignment } = get(
        element,
        'text.view',
        {}
      );

      return new TextElementObject({
        text,
        fontSize: pxToPt(font_size),
        alignment,
        selectable: false
      });
    },

    /**
     * Create image element from backend data
     * @param {Obejct} element backend element
     * @returns parallel object data
     */
    createImageElement(element) {
      const { properties } = element?.picture || {};
      const imageUrl = properties?.url?.startsWith('http')
        ? properties?.url
        : '';

      return new ImageElementObject({
        imageUrl,
        selectable: false
      });
    },

    /**
     * Create clipart element from backend data
     * @param {Obejct} element backend element
     * @returns parallel object data
     */
    createClipartElement(element) {
      const { vector = '' } = element?.properties || {};

      return new ClipArtElementObject({
        vector,
        selectable: false
      });
    },

    /**
     * Get element dimension for parallel object
     * @param {Object} element backend data
     * @returns parallel object dimension
     */
    getElementDimension(element) {
      const {
        size: { width, height },
        position: { top, left },
        opacity
      } = element?.view || {};

      const size = {
        width: pxToIn(width),
        height: pxToIn(height)
      };

      const coord = {
        x: pxToIn(left),
        y: pxToIn(top)
      };

      return { size, coord, opacity };
    },

    /**
     * Get scale value
     * @returns scale value
     */
    getScaleValue() {
      const zoom = +get(this.$route, 'query.scale', 1);
      if (!zoom || zoom > 1) return 1;

      if (zoom < 0.01) return 0.01;

      return zoom;
    }
  },
  beforeMount() {
    this.zoom = this.getScaleValue();

    sessionStorage.setItem('token', get(this.$route, 'query.token', ''));
  },
  async mounted() {
    this.createCanvas();

    try {
      const pageId = get(this.$route, 'params.pageId');
      if (isEmpty(pageId)) return;

      const data = await this.getPageData(pageId);

      const elements = get(data, 'page.layout.elements', []);

      const imageUrl = get(data, 'page.layout.view.background.image_url', '');

      const objs = this.createElementsFromPpData(elements);

      const backgroundElement = new BackgroundElementObject({
        imageUrl
      });

      objs.unshift(backgroundElement);

      this.drawObjectsOnCanvas(objs);
    } catch (ex) {
      this.dispatchLoadedEvent();
    }
  }
};
