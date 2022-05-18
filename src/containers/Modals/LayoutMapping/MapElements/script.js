import { fabric } from 'fabric';
import { cloneDeep } from 'lodash';
import {
  drawObjectsOnCanvas,
  isBackground,
  isSingleLayout,
  modifyBgToRenderOnPage,
  resetObjects,
  isEmpty,
  getMappingColor,
  isPpTextObject,
  isPpImageObject,
  isFbTextObject
} from '@/common/utils';
import CommonModal from '@/components/Modals/CommonModal';
import PreviewItem from './PreviewItem';
import NumberPalettes from './NumberPalettes';
import {
  DIGITAL_CANVAS_SIZE,
  PRINT_CANVAS_SIZE,
  OBJECT_TYPE,
  THUMBNAIL_IMAGE_CONFIG,
  IMAGE_LOCAL
} from '@/common/constants';
import { addEventListeners, createMediaOverlay } from '@/common/fabricObjects';
import { useAppCommon, useMappingTemplate } from '@/hooks';
import { renderObjectOverlay } from '@/plugins/fabric';

export default {
  components: { CommonModal, PreviewItem, NumberPalettes },
  props: {
    printLayout: {
      type: Object,
      default: () => ({})
    },
    digitalLayout: {
      type: Object,
      default: () => ({})
    },
    config: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    const { setLoadingState } = useAppCommon();
    const { createTemplateMapping } = useMappingTemplate();
    return { setLoadingState, createTemplateMapping };
  },
  data() {
    const printPreview = [
      {
        id: this.printLayout.id,
        previewImageUrl: this.printLayout.previewImageUrl,
        liveThumbnail: ''
      }
    ];

    const frames = this.digitalLayout?.frames || [];
    const digitalPreview = frames.map(f => ({
      id: f.id,
      previewImageUrl: f.previewImageUrl,
      liveThumbnail: ''
    }));
    return {
      idOfActiveImage: null,
      canvas: null,
      printPreview,
      digitalPreview,
      overlayData: {},
      posX: 0,
      posY: 0,
      isOpenMenu: false,
      numberList: [],
      currentObjectId: null,
      textIcon: null,
      imageIcon: null,
      textColors: [],
      imageColors: [],
      isCanvasReady: false // only show canvas when all thumbnail are generated
    };
  },
  computed: {
    isSingleLayout() {
      return isSingleLayout(this.printLayout);
    },
    isPrint() {
      return this.idOfActiveImage === this.printLayout.id;
    },
    /**
     *  To get objects which will be render on canvas
     *
     * @returns array of pp objects
     */
    activeObjects() {
      const frames = this.digitalLayout?.frames || [];
      const digitalObject = frames.map(f => ({ [f.id]: f.objects }));

      const printObjects = { [this.printLayout.id]: this.printLayout.objects };
      const objects = Object.assign({}, ...digitalObject, printObjects);
      return objects[this.idOfActiveImage];
    },
    frameName() {
      if (this.isPrint) return '';

      const index = this.digitalLayout?.frames.findIndex(
        f => f.id === this.idOfActiveImage
      );

      return `Frame ${index + 1}`;
    },
    isAcceptButtonDisabled() {
      return false;
    }
  },
  async mounted() {
    this.setLoadingState({ value: true });
    const el = this.$refs['layout-mapping-canvas'];

    this.canvas = new fabric.Canvas(el, {
      backgroundColor: '#fff',
      preserveObjectStacking: true
    });

    // load hover icon
    this.textIcon = await createMediaOverlay(IMAGE_LOCAL.ADD_TEXT_ICON);
    this.imageIcon = await createMediaOverlay(IMAGE_LOCAL.ADD_IMAGE_ICON);

    // get colors
    const { maxText, maxImage } = this.getMaxIndex();
    this.textColors = Array(maxText)
      .fill(0)
      .map(() => getMappingColor());
    this.imageColors = Array(maxImage)
      .fill(0)
      .map(() => getMappingColor(true));

    this.initData();

    // generate digital thumbnails
    await this.updateDigitalFramePreview();

    this.idOfActiveImage = this.printLayout.id;
    await this.handleRenderCanvas(true);

    this.setLoadingState({ value: false });

    // display canvas
    this.isCanvasReady = true;
  },
  methods: {
    /**
     * Close the mapping layout modal
     */
    onCancel() {
      this.$emit('onCancel');
    },

    /**
     * Call API to save mapping layout when user hit save button
     */
    async onSave() {
      const frameIds = this.digitalLayout.frames.map(f => f.id);

      await this.createTemplateMapping(
        this.printLayout.id,
        frameIds,
        this.overlayData,
        this.config
      );

      this.$emit('onClose');
    },
    /**
     * To set which sheet / frame is currently active
     *
     * @param {String} id container id
     */
    setActiveImage(id) {
      this.idOfActiveImage = id;
      this.isOpenMenu = false;
      this.handleRenderCanvas();
    },
    isTextImageObject(object) {
      return (
        object.objectType === OBJECT_TYPE.IMAGE ||
        object.objectType === OBJECT_TYPE.TEXT
      );
    },
    /**
     * Handle render objects on canvas
     *
     * @param {Boolean} isHideLoading
     */
    async handleRenderCanvas(isHideLoading) {
      isHideLoading || this.setLoadingState({ value: true });

      if (isEmpty(this.activeObjects)) return;

      const EDITOR_SIZE = this.isPrint
        ? PRINT_CANVAS_SIZE
        : DIGITAL_CANVAS_SIZE;

      const width =
        !this.isPrint || !this.isSingleLayout
          ? EDITOR_SIZE.WIDTH
          : Math.ceil(EDITOR_SIZE.WIDTH / 2);

      const height = EDITOR_SIZE.HEIGHT;
      const zoom = 0.3378; // this value is choosen so that the cavnas size match the size on the design
      this.canvas.setHeight(height * zoom);
      this.canvas.setWidth(width * zoom);

      this.canvas.setZoom(zoom);

      resetObjects(this.canvas);

      const objects = cloneDeep(this.activeObjects);

      const isShowPointer = object => {
        if (!this.isTextImageObject(object)) return 'default';

        return 'pointer';
      };

      const preprocessingFunc = fbObjects => {
        fbObjects.forEach(o => {
          o.set({ selectable: false });

          o.set({ showOverlay: this.overlayData[o.id] });
          o.set({ hoverCursor: isShowPointer(o) });

          addEventListeners(o, {
            mousedown: this.handleMouseDown,
            mouseover: this.handleMouseOver,
            mouseout: this.handleMouseOut
          });
        });
      };

      // modify backround if render on a page
      if (this.isSingleLayout && isBackground(objects[0]))
        objects[0] = modifyBgToRenderOnPage(objects[0]);

      const backgrounds = objects.filter(isBackground);
      const otherObjects = objects.filter(o => !isBackground(o));

      await drawObjectsOnCanvas(
        [...backgrounds, ...otherObjects],
        this.canvas,
        preprocessingFunc
      );

      // without this timeout, canvas will blank on UI
      await new Promise(resolve => {
        setTimeout(() => {
          this.updateThumbnails();
          resolve();
        }, 10);
      });

      isHideLoading || this.setLoadingState({ value: false });
    },
    /**
     *  To get a list of value is in used in print
     *
     * @param {Boolean} isImage is image object
     * @returns array of numbers
     */
    getInUsedValuePrint(isImage) {
      const isRightType = isImage ? isPpImageObject : isPpTextObject;
      return this.printLayout.objects
        .map(o => (isRightType(o) ? this.overlayData[o.id]?.value : null))
        .filter(Boolean);
    },
    /**
     *  To get a list of value is in used in digital
     *
     * @param {Boolean} isImage is image object
     * @returns array of numbers
     */
    getInUsedValueDigital(isImage) {
      const isRightType = isImage ? isPpImageObject : isPpTextObject;
      return this.digitalLayout.frames
        .map(frame => {
          return frame.objects
            .map(o => (isRightType(o) ? this.overlayData[o.id]?.value : null))
            .filter(Boolean);
        })
        .flat();
    },
    /**
     * Get list of number to display on the dropdown menu
     */
    getNumberList() {
      this.numberList = [];
      const curShowOverlay = this.overlayData[this.currentObjectId];

      const isImage = curShowOverlay.isImage;
      const { maxText, maxImage } = this.getMaxIndex();
      const maxValue = isImage ? maxImage : maxText;

      const assignedNumbers = Object.values(this.overlayData)
        .filter(o => (isImage ? o.isImage : !o.isImage))
        .map(o => o.value);

      if (curShowOverlay.value > 0)
        this.numberList.push({ title: 'Unassign', value: -1, color: 'white' });

      // get list of in used values
      const inUsedValues = this.isPrint
        ? this.getInUsedValuePrint(isImage)
        : this.getInUsedValueDigital(isImage);

      Array.from(Array(maxValue).keys()).forEach(value => {
        const v = value + 1;
        if (inUsedValues.includes(v)) return;
        this.numberList.push({
          title: `${v}`,
          value: v,
          color: this.getObjectColor(v, isImage),
          isBold: assignedNumbers.includes(v)
        });
      });

      const curValue = this.overlayData[this.currentObjectId].value;

      if (curValue < 0) return;

      this.numberList.push({
        title: `${curValue}`,
        value: curValue,
        active: true,
        color: this.getObjectColor(curValue, isImage),
        isBold: assignedNumbers.includes(curValue)
      });

      const sortList = this.numberList
        .slice(1)
        .sort((a, b) => a.value - b.value);

      this.numberList = [this.numberList[0], ...sortList];
    },
    /**
     * Get color of a object
     *
     * @param {Number} index index of object
     * @param {Boolean} isImage is image or text object
     * @returns color
     */
    getObjectColor(index, isImage) {
      return isImage ? this.imageColors[index - 1] : this.textColors[index - 1];
    },
    /**
     * Trigger when use click on canvas
     *
     * @param {Object} e  event object
     */
    handleMouseDown(e) {
      if (!this.isTextImageObject(e.target)) {
        this.isOpenMenu = false;
        return;
      }

      const { clientX, clientY } = e.e;

      this.posX = clientX - 10;
      this.posY = clientY - 10;

      this.currentObjectId = e.target.id;
      this.getNumberList();
      this.isOpenMenu = true;
    },
    /**
     * Trigger when use move the pointer on canvas
     *
     * @param {Object} e  event object
     */
    handleMouseOver({ target }) {
      if (!this.isTextImageObject(target)) return;

      const icon = isFbTextObject(target) ? this.textIcon : this.imageIcon;

      renderObjectOverlay(target, icon);
    },
    /**
     * Trigger when use move the pointer out of the canvas
     *
     * @param {Object} e  event object
     */
    handleMouseOut() {
      this.canvas.renderAll();
    },
    /**
     *  Trigger when use choose a number on dropdown menu
     */
    onChooseNumber(e) {
      if (!e || e.value === this.overlayData[this.currentObjectId].value)
        return this.onCloseNumberMenu();

      this.overlayData[this.currentObjectId].value = e.value;
      this.overlayData[this.currentObjectId].isDisplayed = e.value > 0;

      const isImage = this.overlayData[this.currentObjectId].isImage;

      this.overlayData[this.currentObjectId].color = this.getObjectColor(
        e.value,
        isImage
      );

      this.onCloseNumberMenu();
      this.handleRenderCanvas();
    },
    /**
     * Close dropdow menu
     */
    onCloseNumberMenu() {
      this.isOpenMenu = false;
    },
    /**
     * Get max index of text and image objects
     */
    getMaxIndex() {
      let numOfPrintTexts = 0;
      let numOfPrintImages = 0;
      let numOfDigitalTexts = 0;
      let numOfDigitalImages = 0;

      this.printLayout.objects.forEach(o => {
        isPpTextObject(o) && numOfPrintTexts++;
        isPpImageObject(o) && numOfPrintImages++;
      });

      this.digitalLayout.frames.forEach(frame => {
        frame.objects.forEach(o => {
          isPpTextObject(o) && numOfDigitalTexts++;
          isPpImageObject(o) && numOfDigitalImages++;
        });
      });

      return {
        maxText: Math.max(numOfPrintTexts, numOfDigitalTexts),
        maxImage: Math.max(numOfDigitalImages, numOfPrintImages)
      };
    },
    /**
     * Init data of overlayData
     */
    initData() {
      let textNum = 1;
      let imageNum = 1;

      this.overlayData = {};

      const getIsDisplay = (id, isPrint) => {
        if (isEmpty(this.config)) return isPrint;

        const att = isPrint ? 'printElementId' : 'digitalElementId';

        return this.config.elementMappings.map(m => m[att]).includes(id);
      };

      const getPrintIndex = (isImage, isDisplayed) => {
        if (isEmpty(this.config) || isDisplayed)
          return isImage ? imageNum++ : textNum++;

        return -1;
      };

      const getDigitalIndex = id => {
        if (isEmpty(this.config)) return -1;

        const elementMappings = this.config.elementMappings.find(
          m => m.digitalElementId === id
        );

        const printElementId = elementMappings?.printElementId || null;
        if (!printElementId) return -1;

        return this.overlayData[printElementId].value || -1;
      };

      this.printLayout.objects.forEach(o => {
        if (!isPpTextObject(o) && !isPpImageObject(o)) return;

        const isImage = isPpImageObject(o);
        const isDisplayed = getIsDisplay(o.id, true);
        const index = getPrintIndex(isImage, isDisplayed);
        const color = this.getObjectColor(index, isImage);

        const showOverlay = {
          id: o.id,
          color,
          isDisplayed,
          value: index,
          isImage,
          isPrint: true,
          containerId: this.printLayout.id
        };

        this.overlayData[o.id] = showOverlay;
      });

      textNum = 1;
      imageNum = 1;
      const frames = this.digitalLayout?.frames || [];

      frames.forEach(frame => {
        frame.objects.forEach(o => {
          if (!isPpTextObject(o) && !isPpImageObject(o)) return;

          const isImage = isPpImageObject(o);
          const isDisplayed = getIsDisplay(o.id, false);
          const index = getDigitalIndex(o.id);
          const color = this.getObjectColor(index, isImage);

          const props = isDisplayed
            ? { color, isDisplayed }
            : { color: 'black', isDisplayed: false };

          const showOverlay = {
            id: o.id,
            isImage,
            isPrint: false,
            containerId: frame.id,
            value: index,
            ...props
          };

          this.overlayData[o.id] = showOverlay;
        });
      });
    },
    /**
     * Update left sidebar thumbnails
     */
    updateThumbnails() {
      const thumbnailUrl = this.canvas.toDataURL({
        quality: THUMBNAIL_IMAGE_CONFIG.QUALITY,
        format: THUMBNAIL_IMAGE_CONFIG.FORMAT,
        multiplier: THUMBNAIL_IMAGE_CONFIG.MULTIPLIER
      });

      const currWorkspace = [...this.printPreview, ...this.digitalPreview].find(
        item => item.id === this.idOfActiveImage
      );

      currWorkspace.liveThumbnail = thumbnailUrl;
    },
    /**
     * To generate digital frame preview for mapped frames
     */
    async updateDigitalFramePreview() {
      if (isEmpty(this.config)) return;

      const frameIds = this.digitalLayout?.frames.map(f => f.id) || [];

      for (const id of frameIds) {
        this.setActiveImage(id);
        await this.handleRenderCanvas();
      }
    }
  }
};
