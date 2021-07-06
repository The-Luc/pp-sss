import { fabric } from 'fabric';

import { DIGITAL_CANVAS_SIZE } from '@/common/constants/canvas';
import SizeWrapper from '@/components/SizeWrapper';
import AddBoxInstruction from '@/components/AddBoxInstruction';
import { useDigitalOverrides } from '@/plugins/fabric';
import { OBJECT_TYPE, SHEET_TYPE } from '@/common/constants';
import {
  applyTextBoxProperties,
  createTextBox,
  startDrawBox,
  toggleStroke,
  updateTextListeners
} from '@/common/fabricObjects';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { useDrawLayout, useInfoBar } from '@/hooks';

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
  setCanvasUniformScaling
} from '@/common/utils';
import { GETTERS as APP_GETTERS, MUTATES } from '@/store/modules/app/const';
import { GETTERS } from '@/store/modules/book/const';
import {
  ACTIONS as DIGITAL_ACTIONS,
  GETTERS as DIGITAL_GETTERS,
  MUTATES as DIGITAL_MUTATES
} from '@/store/modules/digital/const';
import { cloneDeep, debounce } from 'lodash';
import { THUMBNAIL_IMAGE_QUALITY } from '@/common/constants/config';

const ELEMENTS = {
  [OBJECT_TYPE.TEXT]: 'a text box',
  [OBJECT_TYPE.IMAGE]: 'an image box'
};

export default {
  components: {
    SizeWrapper,
    AddBoxInstruction
  },
  setup() {
    const { drawLayout } = useDrawLayout();
    const { setInfoBar, zoom } = useInfoBar();

    return { drawLayout, setInfoBar, zoom };
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
      digitalCanvas: null
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
      totalBackground: DIGITAL_GETTERS.TOTAL_BACKGROUND
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
      setObjects: DIGITAL_MUTATES.SET_OBJECTS,
      addNewObject: DIGITAL_MUTATES.ADD_OBJECT,
      setObjectProp: DIGITAL_MUTATES.SET_PROP,
      setObjectPropById: DIGITAL_MUTATES.SET_PROP_BY_ID,
      updateTriggerTextChange: DIGITAL_MUTATES.UPDATE_TRIGGER_TEXT_CHANGE,
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
      deleteBackground: DIGITAL_MUTATES.DELETE_BACKGROUND
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
      window.digitalCanvas.setWidth(canvasSize.width);
      window.digitalCanvas.setHeight(canvasSize.height);
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
     * Update component's event listeners after component has been mouted
     */
    updateDigitalEventListeners() {
      const elementEvents = [
        {
          name: EVENT_TYPE.DIGITAL_ADD_ELEMENT,
          handler: this.onAddElement
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
      const events = [...elementEvents, ...textEvents];
      events.forEach(event => {
        this.$root.$on(event.name, event.handler);
      });
    },

    /**
     * Update window event listeners
     */
    updateWindowEventListeners() {
      const events = [
        {
          name: WINDOW_EVENT_TYPE.KEY_UP,
          handler: this.onKeyUp
        }
      ];
      events.forEach(event => {
        document.body.addEventListener(event.name, event.handler);
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

      const objectData = this.selectedObject;

      if (targetType === 'group' && target.objectType === OBJECT_TYPE.TEXT) {
        const rectObj = target.getObjects(OBJECT_TYPE.RECT)[0];
        setBorderObject(rectObj, objectData);
      }

      const objectType = objectData?.type;
      const isSelectMultiObject = !objectType;

      if (isSelectMultiObject) {
        setCanvasUniformScaling(this.digitalCanvas, true);
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
      if (this.propertiesObjectType !== OBJECT_TYPE.BACKGROUND) {
        this.setIsOpenProperties({ isOpen: false });

        this.setPropertiesObjectType({ type: '' });
      }

      this.setObjectTypeSelected({ type: '' });

      this.toggleActiveObjects(false);

      this.setSelectedObjectId({ id: '' });
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
      console.log('object:removed');
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

      this.setInfoBar({
        w: prop.size.width,
        h: prop.size.height
      });
    },

    /**
     * Event fire when fabric object has been moved
     */
    onObjectMoved() {
      console.log('object:moved');
    },

    /**
     * Event fire when click on fabric canvas
     */
    onMouseDown(event) {
      if (this.awaitingAdd) {
        this.stopAddingInstruction();
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
      // this.handleAddTextEventListeners(object, data);
      const events = {
        // rotated: this.handleRotated,
        // moved: this.handleMoved,
        // scaling: e => handleScalingText(e, text),
        // scaled: e => this.handleTextBoxScaled(e, rect, text, data),
        mousedblclick: e => this.handleDbClickText(e, rect, text)
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
    onTextChanged() {
      console.log('text:changed');
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
      this.setToolNameSelected({ name: '' });
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
     * @param {Object} e Text event data
     * @param {Element} rect Rect object
     * @param {Element} text Text object
     */
    handleDbClickText(e, rect, text) {
      const group = e.target;
      const canvas = e.target.canvas;
      if (isEmpty(canvas)) return;

      const textForEditing = cloneDeep(text);
      const rectForEditing = cloneDeep(rect);
      const { flipX, flipY, angle, top, left } = cloneDeep(group);
      const cachedData = { flipX, flipY, angle, top, left };

      text.visible = false;
      rect.visible = false;

      group.addWithUpdate();

      updateTextListeners(
        textForEditing,
        rectForEditing,
        group,
        cachedData,
        text => {
          this.changeTextProperties({
            text
          });
        }
      );

      canvas.add(rectForEditing);
      canvas.add(textForEditing);

      canvas.setActiveObject(textForEditing);

      toggleStroke(rectForEditing, true);

      textForEditing.enterEditing();
      textForEditing.selectAll();
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
    }, 250)
  },
  watch: {
    pageSelected: {
      deep: true,
      async handler(val, oldVal) {
        if (val?.id !== oldVal?.id) {
          await this.getDataCanvas();
          this.countPaste = 1;
          this.setSelectedObjectId({ id: '' });
          // TODO: error, ask later
          this.updateCanvasSize();
          resetObjects(this.digitalCanvas);
          this.drawLayout(this.sheetLayout);
        }
      }
    }
  },
  beforeDestroy() {
    this.digitalCanvas = null;
  }
};
