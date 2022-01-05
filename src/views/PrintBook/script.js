import {
  getPagePrintSize,
  inToPx,
  isEmpty,
  isFullBackground
} from '@/common/utils';
import {
  imageBorderModifier,
  useDoubleStroke,
  useOverrides
} from '@/plugins/fabric';
import { fabric } from 'fabric';
import { usePageApi } from './composables';
import { OBJECT_TYPE, PRINT_DPI, PDF_DPI } from '@/common/constants';
import {
  applyBorderToImageObject,
  applyShadowToObject,
  createBackgroundFabricObject,
  createImage,
  createPortraitImage,
  createTextBox,
  handleGetClipart,
  handleGetSvgData,
  updateSpecificProp
} from '@/common/fabricObjects';
import { get } from 'lodash';

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
    async drawObjectsOnCanvas(objects, facingObjects) {
      if (isEmpty(objects)) return;

      const createObjectMethod = {
        [OBJECT_TYPE.SHAPE]: this.createSvgFromPpData,
        [OBJECT_TYPE.CLIP_ART]: this.createClipartFromPpData,
        [OBJECT_TYPE.TEXT]: this.createTextFromPpData,
        [OBJECT_TYPE.IMAGE]: this.createImageFromPpData,
        [OBJECT_TYPE.PORTRAIT_IMAGE]: this.createPortraitImageFromPpData,
        [OBJECT_TYPE.BACKGROUND]: this.createBackgroundFromPpData
      };

      const allObjectPromises = objects.map(objectData => {
        return createObjectMethod[objectData.type](objectData);
      });

      const isEmptyBackground = objects[0].type !== OBJECT_TYPE.BACKGROUND;

      const isFacingBackground =
        !isEmpty(facingObjects) &&
        facingObjects[0].type === OBJECT_TYPE.BACKGROUND &&
        isFullBackground(facingObjects[0]);

      if (isEmptyBackground && isFacingBackground) {
        allObjectPromises.unshift(
          this.createBackgroundFromPpData(facingObjects[0], true)
        );
      }

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
      const svgObject = {
        id: objectData.id,
        object: objectData
      };

      const svg = await handleGetSvgData({
        svg: svgObject,
        svgUrlAttrName:
          objectData.type === OBJECT_TYPE.CLIP_ART ? 'vector' : 'pathData',
        expectedHeight: objectData.size.height,
        expectedWidth: objectData.size.width
      });

      const {
        dropShadow,
        shadowBlur,
        shadowOffset,
        shadowOpacity,
        shadowAngle,
        shadowColor
      } = svg;

      applyShadowToObject(svg, {
        dropShadow,
        shadowBlur,
        shadowOffset,
        shadowOpacity,
        shadowAngle,
        shadowColor
      });

      return svg;
    },

    /**
     * add clipart to the store and create fabric object
     *
     * @param {Object} clipart PpData of the of a clipart object {id, size, coord,...}
     * @returns {Object} a fabric object
     */
    async createClipartFromPpData(objectData) {
      const clipart = await handleGetClipart({
        object: objectData,
        expectedHeight: objectData.size.height,
        expectedWidth: objectData.size.width
      });

      const {
        dropShadow,
        shadowBlur,
        shadowOffset,
        shadowOpacity,
        shadowAngle,
        shadowColor
      } = clipart;

      applyShadowToObject(clipart, {
        dropShadow,
        shadowBlur,
        shadowOffset,
        shadowOpacity,
        shadowAngle,
        shadowColor
      });

      return clipart;
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
      const { border, cropInfo } = imageProperties;

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

      if (!isEmpty(cropInfo)) {
        image.set({ cropInfo });
      }

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
    async createBackgroundFromPpData(backgroundProp, isFacing = false) {
      return createBackgroundFabricObject(
        backgroundProp,
        this.canvas,
        null,
        true,
        isFullBackground(backgroundProp) ? 0.5 : 1,
        isFacing
      );
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
     * Get scale value
     * @returns scale value
     */
    getScaleValue() {
      const zoom = +get(this.$route, 'query.scale', 1);

      const ratio = PDF_DPI / PRINT_DPI;

      if (!zoom || zoom > 1) return ratio;

      return zoom < 0.01 ? ratio * 0.01 : zoom * ratio;
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

      const facingElements = get(data, 'page.facing_page.layout.elements', []);

      this.drawObjectsOnCanvas(elements, facingElements);
    } catch (ex) {
      this.dispatchLoadedEvent();
    }
  }
};
