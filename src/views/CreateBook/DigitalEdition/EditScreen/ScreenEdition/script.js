import { fabric } from 'fabric';

import { DIGITAL_CANVAS_SIZE } from '@/common/constants/canvas';
import SizeWrapper from '@/components/SizeWrapper';
import AddBoxInstruction from '@/components/AddBoxInstruction';
import Frames from './Frames';
import { useDigitalOverrides } from '@/plugins/fabric';
import {
  ACTIVE_EDITION,
  ARRANGE_SEND,
  DEFAULT_CLIP_ART,
  DEFAULT_IMAGE,
  DEFAULT_SHAPE,
  EDITION,
  OBJECT_TYPE,
  SHEET_TYPE,
  TOOL_NAME
} from '@/common/constants';
import {
  addPrintClipArts,
  addPrintShapes,
  applyShadowToObject,
  applyTextBoxProperties,
  calcScaleElement,
  createTextBox,
  setTextDimensionAfterScaled,
  handleObjectBlur,
  handleScalingText,
  mappingElementProperties,
  startDrawBox,
  updateElement,
  addDigitalBackground,
  deleteObjectById,
  enableTextEditMode
} from '@/common/fabricObjects';
import { createImage } from '@/common/fabricObjects';
import { mapGetters, mapActions, mapMutations } from 'vuex';

import {
  useDrawLayout,
  useInfoBar,
  useLayoutPrompt,
  useFrame,
  useFrameSwitching
} from '@/hooks';

import {
  ImageElement,
  ClipArtElement,
  ShapeElement,
  BackgroundElement
} from '@/common/models';

import {
  CANVAS_EVENT_TYPE,
  EVENT_TYPE,
  WINDOW_EVENT_TYPE
} from '@/common/constants/eventType';
import {
  deleteSelectedObjects,
  isEmpty,
  pxToIn,
  resetObjects,
  selectLatestObject,
  setActiveCanvas,
  setBorderHighLight,
  setBorderObject,
  setCanvasUniformScaling,
  isNonElementPropSelected
} from '@/common/utils';
import { GETTERS as APP_GETTERS, MUTATES } from '@/store/modules/app/const';
import { GETTERS } from '@/store/modules/book/const';
import {
  ACTIONS as DIGITAL_ACTIONS,
  GETTERS as DIGITAL_GETTERS,
  MUTATES as DIGITAL_MUTATES
} from '@/store/modules/digital/const';
import { cloneDeep, debounce, merge, uniqueId } from 'lodash';
import {
  MAX_SUPPLEMENTAL_FRAMES,
  THUMBNAIL_IMAGE_QUALITY
} from '@/common/constants/config';
import { useAppCommon } from '@/hooks/common';

const ELEMENTS = {
  [OBJECT_TYPE.TEXT]: 'a text box',
  [OBJECT_TYPE.IMAGE]: 'an image box'
};

export default {
  components: {
    SizeWrapper,
    AddBoxInstruction,
    Frames
  },
  setup() {
    const { setActiveEdition } = useAppCommon();
    const { drawLayout } = useDrawLayout();
    const { setInfoBar, zoom } = useInfoBar();
    const { openPrompt } = useLayoutPrompt();
    const { handleSwitchFrame } = useFrameSwitching();
    const { frames, currentFrameId } = useFrame();

    return {
      setActiveEdition,
      frames,
      currentFrameId,
      drawLayout,
      setInfoBar,
      zoom,
      openPrompt,
      handleSwitchFrame
    };
  },
  data() {
    return {
      containerSize: null,
      canvasSize: null,
      element: '',
      x: 0,
      y: 0,
      visible: false,
      awaitingAdd: '',
      digitalCanvas: null,
      showAddFrame: true
    };
  },
  computed: {
    ...mapGetters({
      book: GETTERS.BOOK_DETAIL,
      pageSelected: DIGITAL_GETTERS.CURRENT_SHEET,
      sheetLayout: DIGITAL_GETTERS.SHEET_LAYOUT,
      isOpenMenuProperties: APP_GETTERS.IS_OPEN_MENU_PROPERTIES,
      selectedObject: DIGITAL_GETTERS.CURRENT_OBJECT,
      toolNameSelected: APP_GETTERS.SELECTED_TOOL_NAME,
      currentBackgrounds: DIGITAL_GETTERS.BACKGROUNDS,
      propertiesObjectType: APP_GETTERS.PROPERTIES_OBJECT_TYPE,
      object: DIGITAL_GETTERS.OBJECT_BY_ID,
      currentObjects: DIGITAL_GETTERS.GET_OBJECTS,
      totalBackground: DIGITAL_GETTERS.TOTAL_BACKGROUND,
      listObjects: DIGITAL_GETTERS.GET_OBJECTS,
      triggerApplyLayout: DIGITAL_GETTERS.TRIGGER_APPLY_LAYOUT
    }),
    isCover() {
      return this.pageSelected?.type === SHEET_TYPE.COVER;
    },
    isIntro() {
      const { sections } = this.book;
      return this.pageSelected?.id === sections[1].sheets[0].id;
    },
    currentSheetType() {
      return this.pageSelected?.type || -1;
    }
  },
  methods: {
    ...mapActions({
      getDataCanvas: DIGITAL_ACTIONS.GET_DATA_CANVAS
    }),
    ...mapMutations({
      setBookId: DIGITAL_MUTATES.SET_BOOK_ID,
      setIsOpenProperties: MUTATES.TOGGLE_MENU_PROPERTIES,
      setToolNameSelected: MUTATES.SET_TOOL_NAME_SELECTED,
      setObjectTypeSelected: MUTATES.SET_OBJECT_TYPE_SELECTED,
      setSelectedObjectId: DIGITAL_MUTATES.SET_CURRENT_OBJECT_ID,
      setCurrentObject: MUTATES.SET_CURRENT_OBJECT,
      setObjects: DIGITAL_MUTATES.SET_OBJECTS,
      addNewObject: DIGITAL_MUTATES.ADD_OBJECT,
      setObjectProp: DIGITAL_MUTATES.SET_PROP,
      setObjectPropById: DIGITAL_MUTATES.SET_PROP_BY_ID,
      updateTriggerTextChange: MUTATES.UPDATE_TRIGGER_TEXT_CHANGE,
      addNewBackground: DIGITAL_MUTATES.SET_BACKGROUNDS,
      updateTriggerBackgroundChange:
        DIGITAL_MUTATES.UPDATE_TRIGGER_BACKGROUND_CHANGE,
      deleteObjects: DIGITAL_MUTATES.DELETE_OBJECTS,
      updateTriggerShapeChange: DIGITAL_MUTATES.UPDATE_TRIGGER_SHAPE_CHANGE,
      setThumbnail: DIGITAL_MUTATES.UPDATE_SHEET_THUMBNAIL,
      updateTriggerClipArtChange: DIGITAL_MUTATES.UPDATE_TRIGGER_CLIPART_CHANGE,
      reorderObjectIds: DIGITAL_MUTATES.REORDER_OBJECT_IDS,
      toggleActiveObjects: MUTATES.TOGGLE_ACTIVE_OBJECTS,
      setPropertiesObjectType: MUTATES.SET_PROPERTIES_OBJECT_TYPE,
      setBackgroundProp: DIGITAL_MUTATES.SET_BACKGROUND_PROP,
      deleteBackground: DIGITAL_MUTATES.DELETE_BACKGROUND,
      setFrames: DIGITAL_MUTATES.SET_FRAMES,
      setCurrentFrameId: DIGITAL_MUTATES.SET_CURRENT_FRAME_ID
    }),
    updateCanvasSize() {
      const canvasSize = {
        width: 0,
        height: 0
      };
      if (this.containerSize.ratio > DIGITAL_CANVAS_SIZE.RATIO) {
        canvasSize.height = this.containerSize.height;
        canvasSize.width = canvasSize.height * DIGITAL_CANVAS_SIZE.RATIO;
      } else {
        canvasSize.width = this.containerSize.width;
        canvasSize.height = canvasSize.width / DIGITAL_CANVAS_SIZE.RATIO;
      }
      const zoom = canvasSize.width / DIGITAL_CANVAS_SIZE.WIDTH;
      this.canvasSize = { ...canvasSize, zoom };

      window.digitalCanvas.setWidth(canvasSize.width);
      window.digitalCanvas.setHeight(canvasSize.height);
      window.digitalCanvas.setZoom(zoom);
    },

    /**
     * Event fire after component has been mouted
     * @param  {Object} containerSize canvas's dimensions
     */
    onContainerReady(containerSize) {
      this.containerSize = containerSize;
      const el = this.$refs.digitalCanvas;
      window.digitalCanvas = new fabric.Canvas(el, {
        backgroundColor: '#fff',
        preserveObjectStacking: true
      });
      setActiveCanvas(window.digitalCanvas);
      useDigitalOverrides(fabric.Object.prototype);
      this.updateCanvasSize();
      this.digitalCanvas = window.digitalCanvas;
      this.updateCanvasEventListeners();
      this.updateDigitalEventListeners();
      this.updateWindowEventListeners();
    },

    /**
     * Event fire after component has been resized
     * @param  {Object} containerSize canvas's dimensions
     */
    onContainerResized(containerSize) {
      this.containerSize = containerSize;
      this.updateCanvasSize();
    },

    /**
     * Handle adding & removing events
     *
     * @param {Boolean} isOn if need to set event
     */
    updateDigitalEventListeners(isOn = true) {
      const elementEvents = [
        {
          name: EVENT_TYPE.SWITCH_TOOL,
          handler: this.onSwitchTool
        },
        {
          name: EVENT_TYPE.DIGITAL_ADD_ELEMENT,
          handler: this.onAddElement
        },
        {
          name: EVENT_TYPE.CHANGE_OBJECT_IDS_ORDER,
          handler: this.changeObjectIdsOrder
        }
      ];

      const textEvents = [
        {
          name: EVENT_TYPE.CHANGE_TEXT_PROPERTIES,
          handler: prop => {
            this.getThumbnailUrl();
            this.changeTextProperties(prop);
          }
        }
      ];

      const backgroundEvents = [
        {
          name: EVENT_TYPE.DIGITAL_BACKGROUND_ADD,
          handler: this.addBackground
        },
        {
          name: EVENT_TYPE.DIGITAL_BACKGROUND_PROP_CHANGE,
          handler: this.changeBackgroundProperties
        },
        {
          name: EVENT_TYPE.DIGITAL_BACKGROUND_REMOVE,
          handler: this.removeBackground
        }
      ];

      const shapeEvents = [
        {
          name: EVENT_TYPE.ADD_SHAPES,
          handler: this.addShapes
        },
        {
          name: EVENT_TYPE.CHANGE_SHAPE_PROPERTIES,
          handler: this.changeShapeProperties
        }
      ];

      const clipArtEvents = [
        {
          name: EVENT_TYPE.ADD_CLIPARTS,
          handler: this.addClipArt
        },
        {
          name: EVENT_TYPE.CHANGE_CLIPART_PROPERTIES,
          handler: this.changeClipArtProperties
        }
      ];

      const events = [
        ...elementEvents,
        ...backgroundEvents,
        ...textEvents,
        ...shapeEvents,
        ...clipArtEvents
      ];

      events.forEach(event => {
        this.$root.$off(event.name, event.handler);

        if (isOn) this.$root.$on(event.name, event.handler);
      });
    },

    /**
     * Update window event listeners
     *
     * @param {Boolean} isOn if need to set event
     */
    updateWindowEventListeners(isOn = true) {
      const events = [
        {
          name: WINDOW_EVENT_TYPE.KEY_UP,
          handler: this.onKeyUp
        }
      ];

      events.forEach(event => {
        document.body.removeEventListener(event.name, event.handler);

        if (isOn) document.body.addEventListener(event.name, event.handler);
      });
    },

    /**
     * Update fabric canvas's event listeners after component has been mouted
     */
    updateCanvasEventListeners() {
      const events = {
        [CANVAS_EVENT_TYPE.SELECTION_CREATED]: this.onSelectionUpdated,
        [CANVAS_EVENT_TYPE.SELECTION_UPDATED]: this.onSelectionUpdated,
        [CANVAS_EVENT_TYPE.SELECTION_CLEARED]: this.onSelectionCleared,
        [CANVAS_EVENT_TYPE.OBJECT_MODIFIED]: this.onObjectModified,
        [CANVAS_EVENT_TYPE.OBJECT_ADDED]: this.onObjectAdded,
        [CANVAS_EVENT_TYPE.OBJECT_REMOVED]: this.onObjectRemoved,
        [CANVAS_EVENT_TYPE.OBJECT_SCALED]: this.onObjectScaled,
        [CANVAS_EVENT_TYPE.OBJECT_MOVED]: this.onObjectMoved,
        [CANVAS_EVENT_TYPE.MOUSE_DOWN]: this.onMouseDown,
        [CANVAS_EVENT_TYPE.TEXT_CHANGED]: this.onTextChanged
      };
      this.digitalCanvas?.on(events);
    },

    onSwitchTool(toolName) {
      const isDiscard =
        toolName &&
        toolName !== TOOL_NAME.DELETE &&
        toolName !== TOOL_NAME.ACTIONS;

      if (isDiscard) {
        this.digitalCanvas?.discardActiveObject();
        this.digitalCanvas?.renderAll();
      }

      if (isNonElementPropSelected(this.propertiesObjectType)) {
        this.setIsOpenProperties({ isOpen: false });

        this.setPropertiesObjectType({ type: '' });
      }

      this.stopAddingInstruction();

      this.awaitingAdd = '';
    },

    /**
     * Event fire when click opject type on toolbar
     * @param element element will be added to canvas
     */
    onAddElement(element) {
      this.stopAddingInstruction();
      this.awaitingAdd = element;
      this.startAddingInstruction();
    },

    /**
     * Event fire when selection of fabric canvas has been created
     */
    onSelectionCreated() {
      console.log('selection:created');
    },

    /**
     * Event fire when selection of fabric canvas has been updated
     * @param {Object}  target  the selected object
     */
    onSelectionUpdated({ target }) {
      if (this.awaitingAdd) {
        return;
      }
      this.toggleActiveObjects(true);

      const { id } = target;
      const targetType = target.get('type');
      this.setSelectedObjectId({ id });

      setBorderHighLight(target, this.sheetLayout);

      const objectData = this.listObjects?.[id] || this.selectedObject;

      this.setCurrentObject(objectData);

      if (targetType === 'group' && target.objectType === OBJECT_TYPE.TEXT) {
        const rectObj = target.getObjects(OBJECT_TYPE.RECT)[0];
        setBorderObject(rectObj, objectData);
      }

      const objectType = objectData?.type;
      const isSelectMultiObject = !objectType;

      if (isSelectMultiObject) {
        setCanvasUniformScaling(this.digitalCanvas, true);
        this.resetConfigTextProperties();
      } else {
        setCanvasUniformScaling(this.digitalCanvas, objectData.isConstrain);
      }

      if (isEmpty(objectType)) return;

      this.setObjectTypeSelected({ type: objectType });

      this.setPropertiesObjectType({ type: objectType });

      this.openProperties(objectType, id);
    },

    /**
     * Event fire when selection of fabric canvas has been cleared
     */
    onSelectionCleared() {
      this.setInfoBar({ w: 0, h: 0 });
      this.closeProperties();
    },

    /**
     * Event fire when fabric object has been added
     */
    onObjectAdded() {
      console.log('object:added');
    },

    /**
     * Event fire when fabric object has been modified
     */
    onObjectModified() {
      console.log('object:modified');
    },

    /**
     * Event fire when fabric object has been removed
     */
    onObjectRemoved() {
      this.setCurrentObject(null);
    },

    /**
     * Event fire when fabric object has been scaled
     * @param target fabric object selected
     */
    onObjectScaled({ target }) {
      const { width, height } = target;
      const prop = {
        size: {
          width: pxToIn(width),
          height: pxToIn(height)
        }
      };
      this.setObjectProp({ prop });
      this.updateTriggerTextChange();
      this.setCurrentObject(this.listObjects?.[target?.id]);

      this.setInfoBar({
        w: prop.size.width,
        h: prop.size.height
      });
    },

    /**
     * Event fire when fabric object has been moved
     * @param {Object} e - Event moved of group
     */
    onObjectMoved(e) {
      if (e.target?.objectType) return;
      const { target } = e;

      target?.getObjects()?.forEach(item => {
        const { id, left, top, objectType } = item;
        const currentXInch = pxToIn(left + target.left + target.width / 2);
        const currentYInch = pxToIn(top + target.top + target.height / 2);

        const prop = {
          coord: {
            x: currentXInch,
            y: currentYInch
          }
        };

        this.setObjectPropById({ id, prop });

        if (objectType === OBJECT_TYPE.SHAPE) {
          this.updateTriggerShapeChange();
        } else if (objectType === OBJECT_TYPE.CLIP_ART) {
          this.updateTriggerClipArtChange();
        } else if (objectType === OBJECT_TYPE.TEXT) {
          this.updateTriggerTextChange();
        }
      });
    },

    /**
     * Event fire when click on fabric canvas
     */
    onMouseDown(event) {
      if (this.awaitingAdd) {
        this.stopAddingInstruction();
        this.setToolNameSelected({ name: '' });
        this.digitalCanvas?.discardActiveObject();
        this.digitalCanvas?.renderAll();

        startDrawBox(this.digitalCanvas, event).then(
          ({ left, top, width, height }) => {
            if (this.awaitingAdd === OBJECT_TYPE.TEXT) {
              this.addText(left, top, width, height);
            }
            // if (this.awaitingAdd === OBJECT_TYPE.IMAGE) {
            //   this.addImageBox(left, top, width, height);
            // }
            this.awaitingAdd = '';
          }
        );
      }
    },

    /**
     * Event fire when click on fabric canvas
     */
    onKeyUp(event) {
      const key = event.keyCode || event.charCode;

      if (event.target === document.body && (key == 8 || key == 46)) {
        deleteSelectedObjects(this.digitalCanvas);
      }
    },

    /**
     * Event fire when user click on Text button on Toolbar to add new text on canvas
     */
    addText(x, y, width, height) {
      const { object, data } = createTextBox(x, y, width, height, {});

      const [rect, text] = object._objects;

      const events = {
        rotated: this.handleRotated,
        moved: this.handleMoved,
        scaling: e => handleScalingText(e, text),
        scaled: e => this.handleTextBoxScaled(e, rect, text, data),
        mousedblclick: ({ target }) => this.handleDbClickText(target)
      };

      object.on(events);

      this.addNewObject(data);

      const isConstrain = data.newObject.isConstrain;

      setCanvasUniformScaling(this.digitalCanvas, isConstrain);

      this.digitalCanvas.add(object);

      setTimeout(() => {
        selectLatestObject(this.digitalCanvas);
      });
    },

    /**
     * Event fire when Text object has been changed
     */
    onTextChanged({ target }) {
      const group = target?.group;
      if (!group) return;

      const minWidth = target.getMinWidth();
      const minHeight = target.height;
      const width = Math.max(group.width, target.width);
      const height = Math.max(group.height, target.height);

      const prop = {
        size: {
          width: pxToIn(width),
          height: pxToIn(height)
        },
        minHeight: pxToIn(minHeight),
        minWidth: pxToIn(minWidth),
        text: target.text
      };

      this.setObjectProp({ prop });
      this.setObjectPropById({ id: group.id, prop });
      this.updateTriggerTextChange();

      this.setInfoBar({ w: prop.size.width, h: prop.size.height });
    },

    /**
     * Handle mouse move when waiting for add new element
     */
    handleBodyMouseMove({ clientX, clientY }) {
      if (!this.digitalCanvas) return;
      const {
        top,
        left,
        width,
        height
      } = this.digitalCanvas.lowerCanvasEl?.getBoundingClientRect();

      const x = clientX - left;
      const y = clientY - top;
      const visible = x > 0 && y > 0 && width - x > 0 && height - y > 0;

      this.x = x;
      this.y = y;
      this.visible = visible;
    },

    /**
     * Handle key press when waiting for add new element
     */
    handleKeyPress(event) {
      const key = event.keyCode || event.charCode;
      if (key === 27) {
        this.awaitingAdd = '';
        this.stopAddingInstruction();
        this.setToolNameSelected({ name: '' });
      }
    },

    /**
     * Event fire when waiting for add new element
     */
    startAddingInstruction() {
      if (!this.awaitingAdd) return;
      this.element = ELEMENTS[this.awaitingAdd] || 'box';

      document.body.addEventListener('mousemove', this.handleBodyMouseMove);
      document.body.addEventListener('keyup', this.handleKeyPress);
    },

    /**
     * Event fire when stop add element
     */
    stopAddingInstruction() {
      this.visible = false;
      this.x = 0;
      this.y = 0;
      document.body.removeEventListener('mousemove', this.handleBodyMouseMove);
      document.body.removeEventListener('keyup', this.handleKeyPress);
    },

    /**
     * Open text properties modal and set default properties
     *
     * @param {String}  objectType  type of selected object
     */
    openProperties(objectType, id) {
      this.setIsOpenProperties({ isOpen: true, objectId: id });
      if (objectType === OBJECT_TYPE.TEXT) {
        this.updateTriggerTextChange();
      }
    },

    /**
     * Set border color when selected group object
     * @param {Element}  group  Group object
     */
    setBorderHighLight(group) {
      group.set({
        borderColor: this.sheetLayout?.id ? 'white' : '#bcbec0'
      });
    },

    /**
     * Event fire when user double click on Text area and allow user edit text as
     * @param {fabric.Object} group - Text Group element
     */
    handleDbClickText(group) {
      enableTextEditMode(group, prop => {
        this.changeTextProperties(prop);
      });
    },

    /**
     * Event fire when user change any property of selected text on the Text Properties
     *
     * @param {Object}  style  new style
     */
    changeTextProperties(prop) {
      if (isEmpty(prop)) {
        this.updateTriggerTextChange();

        return;
      }
      const activeObj = this.digitalCanvas?.getActiveObject();

      if (isEmpty(activeObj)) return;

      this.setObjectProp({ prop });

      this.updateTriggerTextChange();

      if (!isEmpty(prop.size)) {
        this.setInfoBar({
          w: prop.size.width,
          h: prop.size.height
        });
      }

      applyTextBoxProperties(activeObj, prop);

      // update thumbnail
      this.getThumbnailUrl();

      this.setCurrentObject(this.listObjects?.[activeObj?.id]);
    },

    /**
     * call this function to update the active thumbnail
     */
    getThumbnailUrl: debounce(function() {
      const thumbnailUrl = this.digitalCanvas?.toDataURL({
        quality: THUMBNAIL_IMAGE_QUALITY
      });

      this.setThumbnail({
        sheetId: this.pageSelected?.id,
        thumbnailUrl
      });
    }, 250),

    /**
     * Callback function for handle rotated to update
     * @param {Object} e - Shape or Clip art element
     */
    handleRotated(e) {
      const target = e.transform?.target;
      if (isEmpty(target)) return;
      const prop = {
        coord: {
          rotation: target.angle
        }
      };
      const objectType = target.objectType;
      switch (objectType) {
        case OBJECT_TYPE.SHAPE:
          this.changeShapeProperties(prop);
          break;
        case OBJECT_TYPE.CLIP_ART:
          this.changeClipArtProperties(prop);
          break;
        case OBJECT_TYPE.TEXT:
          this.changeTextProperties(prop);
          break;
        default:
          return;
      }
    },
    /**
     * Callback function for handle scaling to set scale for shape base on width and height
     * @param {Object} e - Element Fabric
     */
    handleScaling(e) {
      const target = e.transform?.target;
      if (isEmpty(target)) return;
      let { scaleX, scaleY, width, height } = target;
      const currentWidthInch = pxToIn(width * scaleX);
      const currentHeightInch = pxToIn(height * scaleY);
      const objectType = target.objectType;
      let scale = {};
      switch (objectType) {
        case OBJECT_TYPE.SHAPE:
          scale = calcScaleElement(
            width,
            currentWidthInch,
            currentHeightInch,
            DEFAULT_SHAPE.MIN_SIZE
          );
          break;
        case OBJECT_TYPE.CLIP_ART:
          scale = calcScaleElement(
            width,
            currentWidthInch,
            currentHeightInch,
            DEFAULT_CLIP_ART.MIN_SIZE
          );
          break;
        default:
          return;
      }

      target.set({
        scaleX: scale?.x || scaleX,
        scaleY: scale?.y || scaleY
      });
    },
    /**
     * Callback function for handle scaled to update element's dimension
     * @param {Object} e - Element Fabric
     */
    handleScaled(e) {
      const shadow = e.target?.shadow;
      const target = e.transform?.target;
      if (!isEmpty(shadow)) {
        const oldTarget = e.transform;
        const { offsetX, offsetY, blur } = shadow;
        target.set({
          shadow: {
            ...shadow,
            offsetX: (offsetX * oldTarget.scaleX) / target.scaleX,
            offsetY: (offsetY * oldTarget.scaleY) / target.scaleY,
            blur: handleObjectBlur(blur, oldTarget, target)
          }
        });
      }

      if (isEmpty(target)) return;
      const currentWidthInch = pxToIn(target.width * target.scaleX);
      const currentHeightInch = pxToIn(target.height * target.scaleY);
      const currentXInch = pxToIn(target.left);
      const currentYInch = pxToIn(target.top);
      const objectType = target.objectType;
      switch (objectType) {
        case OBJECT_TYPE.SHAPE: {
          const prop = mappingElementProperties(
            currentWidthInch,
            currentHeightInch,
            currentXInch,
            currentYInch,
            DEFAULT_SHAPE.MIN_SIZE
          );
          this.changeShapeProperties(prop);
          break;
        }

        case OBJECT_TYPE.CLIP_ART: {
          const prop = mappingElementProperties(
            currentWidthInch,
            currentHeightInch,
            currentXInch,
            currentYInch,
            DEFAULT_CLIP_ART.MIN_SIZE
          );
          this.changeClipArtProperties(prop);
          break;
        }
        default:
          return;
      }
    },

    /**
     * Callback function for handle scaled to update text's dimension
     * @param {Object} e - Text event data
     * @param {Element} rect - Rect object
     * @param {Element} text - Text object
     */
    handleTextBoxScaled(e, rect, text) {
      const target = e.transform?.target;

      if (isEmpty(target)) return;

      const currentXInch = pxToIn(target.left);
      const currentYInch = pxToIn(target.top);

      const prop = {
        coord: {
          x: currentXInch,
          y: currentYInch
        }
      };
      this.changeTextProperties(prop);

      setTextDimensionAfterScaled(target, rect, text);
    },

    /**
     * Callback function for handle moved to update element's dimension
     * @param {Object} e - Element Fabric
     */
    handleMoved(e) {
      const target = e.transform?.target;
      if (isEmpty(target)) return;
      const { left, top } = target;
      const currentXInch = pxToIn(left);
      const currentYInch = pxToIn(top);
      const objectType = target.objectType;

      const prop = {
        coord: {
          x: currentXInch,
          y: currentYInch
        }
      };

      switch (objectType) {
        case OBJECT_TYPE.SHAPE:
          this.changeShapeProperties(prop);
          break;
        case OBJECT_TYPE.CLIP_ART:
          this.changeClipArtProperties(prop);
          break;
        case OBJECT_TYPE.TEXT:
          this.changeTextProperties(prop);
          break;
        default:
          return;
      }
    },
    /**
     * Adding shapes to canvas & store
     *
     * @param {Array} shapes  list of object of adding shapes
     */
    async addShapes(shapes) {
      const toBeAddedShapes = shapes.map(s => {
        const newShape = cloneDeep(ShapeElement);

        merge(newShape, s);

        return {
          id: uniqueId(),
          object: newShape
        };
      });

      const eventListeners = {
        scaling: this.handleScaling,
        scaled: this.handleScaled,
        rotated: this.handleRotated,
        moved: this.handleMoved
      };

      await addPrintShapes(
        toBeAddedShapes,
        this.digitalCanvas,
        false,
        false,
        eventListeners
      );

      toBeAddedShapes.forEach(s => {
        const fabricObject = this.digitalCanvas
          .getObjects()
          .find(o => o.id === s.id);

        const { top, left } = fabricObject;

        const newShape = {
          id: s.id,
          newObject: {
            ...s.object,
            coord: {
              x: pxToIn(left),
              y: pxToIn(top)
            }
          }
        };
        this.addNewObject(newShape);
      });

      if (toBeAddedShapes.length === 1) {
        selectLatestObject(this.digitalCanvas);
      } else {
        this.closeProperties();
      }
    },
    /**
     * Event fire when user change any property of selected shape
     *
     * @param {Object}  prop  new prop
     */
    changeShapeProperties(prop) {
      this.changeElementProperties(
        prop,
        OBJECT_TYPE.SHAPE,
        this.updateTriggerShapeChange
      );
    },
    /**
     * Event fire when user change any property of selected clipart
     *
     * @param {Object}  prop  new prop
     */
    changeClipArtProperties(prop) {
      this.changeElementProperties(
        prop,
        OBJECT_TYPE.CLIP_ART,
        this.updateTriggerClipArtChange
      );
    },
    /**
     * Change properties of current element
     *
     * @param {Object}  prop            new prop
     * @param {String}  objectType      object type want to check
     * @param {Object}  updateTriggerFn mutate update trigger function
     */
    changeElementProperties(prop, objectType, updateTriggerFn = null) {
      if (isEmpty(prop)) {
        if (updateTriggerFn !== null) updateTriggerFn();

        return;
      }

      const element = this.digitalCanvas.getActiveObject();

      if (isEmpty(element) || element.objectType !== objectType) return;

      this.setObjectProp({ prop });

      if (updateTriggerFn !== null) updateTriggerFn();

      if (!isEmpty(prop.size)) {
        this.setInfoBar({ w: prop.size.width, h: prop.size.height });
      }

      if (!isEmpty(prop['shadow'])) {
        applyShadowToObject(element, prop['shadow']);
      }

      updateElement(element, prop, this.digitalCanvas);

      // update thumbnail
      this.getThumbnailUrl();
    },
    /**
     * get fired when you click 'send' button
     * change the objectIds order and update z-index of object on canvas
     * @param {string} actionName indicated which 'send' button user clicked
     */
    changeObjectIdsOrder(actionName) {
      const selectedObject = this.digitalCanvas.getActiveObject();
      if (!selectedObject) return;

      const fabricObjects = this.digitalCanvas.getObjects();

      const numBackground = this.totalBackground;

      // if there is only one object -> return
      if (fabricObjects.length <= numBackground + 1) return;

      // indexs based on fabric object array
      let currentObjectIndex = fabricObjects.indexOf(selectedObject);
      let maxIndex = fabricObjects.length - 1;

      // calculate the indexs exclude the number of background
      currentObjectIndex -= numBackground;
      maxIndex -= numBackground;

      /**
       * to call the mutation to re-order objectIds in store and
       * to update the order of objects on canvas
       * @param {Number} oldIndex the current index of the selected object
       * @param {Number} newIndex the new index that the current object will be moved to
       */
      const updateZIndex = (oldIndex, newIndex) => {
        // update to store
        this.reorderObjectIds({ oldIndex, newIndex });
        // udpate to fabric objects on canvas
        fabricObjects[oldIndex + numBackground].moveTo(
          newIndex + numBackground
        );
        //update thumbnail
        this.getThumbnailUrl();
      };

      if (actionName === ARRANGE_SEND.BACK && currentObjectIndex === 0) return;
      if (actionName === ARRANGE_SEND.BACK) {
        updateZIndex(currentObjectIndex, 0);
        return;
      }

      if (actionName === ARRANGE_SEND.FRONT && currentObjectIndex === maxIndex)
        return;
      if (actionName === ARRANGE_SEND.FRONT) {
        updateZIndex(currentObjectIndex, maxIndex);
        return;
      }

      if (actionName === ARRANGE_SEND.BACKWARD && currentObjectIndex === 0)
        return;
      if (actionName === ARRANGE_SEND.BACKWARD) {
        updateZIndex(currentObjectIndex, currentObjectIndex - 1);
        return;
      }

      if (
        actionName === ARRANGE_SEND.FORWARD &&
        currentObjectIndex === maxIndex
      )
        return;
      if (actionName === ARRANGE_SEND.FORWARD) {
        updateZIndex(currentObjectIndex, currentObjectIndex + 1);
        return;
      }
    },

    /**
     * Event fire when user click on Image button on Toolbar to add new image on canvas
     */
    async addImageBox(x, y, width, height) {
      const id = uniqueId();
      const newImage = cloneDeep({
        id,
        newObject: {
          ...ImageElement,
          size: {
            width: pxToIn(width),
            height: pxToIn(height)
          },
          coord: {
            ...ImageElement.coord,
            x: pxToIn(x),
            y: pxToIn(y)
          },
          imageUrl: DEFAULT_IMAGE.IMAGE_URL
        }
      });

      this.addNewObject(newImage);

      const image = await createImage(newImage.newObject);
      this.digitalCanvas.add(image);
      selectLatestObject(this.digitalCanvas);
    },

    /**
     * Event fire when user click on Clip art button on Toolbar to add new clip art on canvas
     * @param {Array} clipArts - list clip art add on Canvas
     */
    async addClipArt(clipArts) {
      const toBeAddedClipArts = clipArts.map(c => {
        const newClipArt = cloneDeep(ClipArtElement);
        const id = uniqueId();

        merge(newClipArt, c);

        return {
          id,
          object: {
            ...newClipArt,
            vector: require(`../../../../../assets/image/clip-art/${newClipArt.vector}`)
          }
        };
      });

      const eventListeners = {
        scaling: this.handleScaling,
        scaled: this.handleScaled,
        rotated: this.handleRotated,
        moved: this.handleMoved
      };

      await addPrintClipArts(
        toBeAddedClipArts,
        this.digitalCanvas,
        false,
        false,
        eventListeners
      );

      toBeAddedClipArts.forEach(s => {
        const fabricObject = this.digitalCanvas
          .getObjects()
          .find(o => o.id === s.id);

        const { height, width, scaleX, scaleY, top, left } = fabricObject;

        const newClipArt = {
          id: s.id,
          newObject: {
            ...s.object,
            coord: {
              x: pxToIn(left),
              y: pxToIn(top)
            },
            size: {
              width: pxToIn(width * scaleX),
              height: pxToIn(height * scaleY)
            }
          }
        };
        this.addObjectToStore(newClipArt);
      });

      if (toBeAddedClipArts.length === 1) {
        selectLatestObject(this.digitalCanvas);
      } else {
        this.closeProperties();
      }
    },
    /**
     * Adding background to canvas & store
     *
     * @param {Object}  background  the object of adding background
     * @param {Boolean} isLeft      is add to the left page or right page
     */
    addBackground({ background }) {
      const id = uniqueId();

      const newBackground = cloneDeep(BackgroundElement);

      merge(newBackground, {
        ...background,
        backgroundId: background.id
      });

      this.addNewBackground({
        background: {
          ...newBackground,
          id,
          isLeftPage: true
        }
      });

      addDigitalBackground({
        id,
        backgroundProp: newBackground,
        canvas: window.digitalCanvas
      });
    },
    /**
     * Event fire when user change any property of selected background
     *
     * @param {Object}  prop  new prop
     */
    changeBackgroundProperties({ backgroundId, prop }) {
      const background = window.digitalCanvas
        .getObjects()
        .find(o => backgroundId === o.id);

      if (isEmpty(background)) return;

      this.setBackgroundProp({ prop });

      this.updateTriggerBackgroundChange();

      updateElement(background, prop, window.digitalCanvas);
    },
    /**
     * Event fire when user click remove background
     *
     * @param {String|Number} backgroundId  id of background will be removed
     */
    removeBackground({ backgroundId }) {
      this.deleteBackground({ isLeft: true });

      deleteObjectById([backgroundId], window.digitalCanvas);

      this.closeProperties();

      this.setIsOpenProperties({ isOpen: false });

      this.setPropertiesObjectType({ type: '' });
    },
    /**
     * Reset configs properties when close object
     */
    resetConfigTextProperties() {
      if (this.propertiesObjectType !== OBJECT_TYPE.BACKGROUND) {
        this.setIsOpenProperties({ isOpen: false });

        this.setPropertiesObjectType({ type: '' });
      }

      this.setObjectTypeSelected({ type: '' });

      this.setSelectedObjectId({ id: '' });

      this.setCurrentObject(null);
    },
    /**
     * Close properties modal
     */
    closeProperties() {
      this.toggleActiveObjects(false);
      this.resetConfigTextProperties();
    },
    /**
     * Handle show/hide add frame button
     * @param {Array} frames supplemental frames
     */
    handleShowAddFrame(frames) {
      this.showAddFrame = frames.length < MAX_SUPPLEMENTAL_FRAMES;
    },
    addObjectToStore(newObject) {
      this.addNewObject(newObject);
    }
  },
  watch: {
    pageSelected: {
      deep: true,
      async handler(val, oldVal) {
        if (val?.id !== oldVal?.id) {
          await this.getDataCanvas();
          this.countPaste = 1;
          this.setSelectedObjectId({ id: '' });
          this.setCurrentFrameId({ id: '' });
          this.setIsOpenProperties({ isOpen: false });
          this.setCurrentObject(null);
          this.updateCanvasSize();
          resetObjects(this.digitalCanvas);
          // reset frames, frameIDs, currentFrameId
          this.setFrames({ framesList: [] });
          this.drawLayout(this.sheetLayout, EDITION.DIGITAL);
        }
      }
    },
    currentFrameId(val) {
      if (!val) return;

      this.setSelectedObjectId({ id: '' });
      this.setCurrentObject(null);
      resetObjects(this.digitalCanvas);

      this.handleSwitchFrame();
      this.drawLayout(this.sheetLayout, EDITION.DIGITAL);
    },
    triggerApplyLayout() {
      this.setSelectedObjectId({ id: '' });
      this.setCurrentObject(null);
      resetObjects(this.digitalCanvas);

      this.drawLayout(this.sheetLayout, EDITION.DIGITAL);
    },

    frames: {
      deep: true,
      handler(val, oldVal) {
        if (val.length !== oldVal.length) {
          const supplementalFrames = val.filter(
            item => !item.frame?.fromLayout
          );
          this.handleShowAddFrame(supplementalFrames);
        }
      }
    }
  },
  mounted() {
    this.setActiveEdition(ACTIVE_EDITION.DIGITAL);
  },
  beforeDestroy() {
    this.digitalCanvas = null;

    this.updateDigitalEventListeners(false);
    this.updateWindowEventListeners(false);

    this.setActiveEdition(ACTIVE_EDITION.NONE);
  }
};
