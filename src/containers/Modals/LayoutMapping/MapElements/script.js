import { fabric } from 'fabric';
import { cloneDeep } from 'lodash';
import {
  drawObjectsOnCanvas,
  isBackground,
  isSingleLayout,
  modifyBgToRenderOnPage,
  resetObjects,
  isEmpty,
  getMappingColor
} from '@/common/utils';
import CommonModal from '@/components/Modals/CommonModal';
import PreviewItem from './PreviewItem';
import {
  DIGITAL_CANVAS_SIZE,
  PRINT_CANVAS_SIZE,
  OBJECT_TYPE,
  IMAGE_LOCAL,
  CROP_CONTROL,
  THUMBNAIL_IMAGE_CONFIG
} from '@/common/constants';
import { renderObjectOverlay } from '@/plugins/fabric';
import { addEventListeners, createMediaOverlay } from '@/common/fabricObjects';

export default {
  components: { CommonModal, PreviewItem },
  props: {
    printLayout: {
      type: Object,
      default: () => ({})
    },
    digitalLayout: {
      type: Object,
      default: () => ({})
    }
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
      digitalPreview
    };
  },
  computed: {
    isSingleLayout() {
      return isSingleLayout(this.printLayout);
    },
    isPrint() {
      return this.idOfActiveImage === this.printLayout.id;
    },
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
    }
  },
  async mounted() {
    this.idOfActiveImage = this.printLayout.id;
    const el = this.$refs['layout-mapping-canvas'];

    this.canvas = new fabric.Canvas(el, {
      backgroundColor: '#fff',
      preserveObjectStacking: true
    });

    await this.handleRenderCanvas();
  },
  methods: {
    onCancel() {
      this.$emit('onCancel');
    },
    onSave() {
      //
    },
    setActiveImage(id) {
      this.idOfActiveImage = id;
      this.handleRenderCanvas();
    },
    isTextImageObject(object) {
      return (
        object.objectType === OBJECT_TYPE.IMAGE ||
        object.objectType === OBJECT_TYPE.TEXT
      );
    },
    async handleRenderCanvas() {
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
        return this.isTextImageObject(object) ? 'pointer' : 'default';
      };

      let textNum = 0;
      let imageNum = 0;
      const control = await createMediaOverlay(IMAGE_LOCAL.CONTROL_ICON, {
        width: CROP_CONTROL.WIDTH,
        height: CROP_CONTROL.HEIGHT
      });

      const preprocessingFunc = fbObjects => {
        fbObjects.forEach(o => {
          o.set({ selectable: false });
          o.set({ hoverCursor: isShowPointer(o) });

          // is text or image object
          if (!this.isTextImageObject(o)) return;
          const isImage = o.objectType === OBJECT_TYPE.IMAGE;
          const index = isImage ? imageNum++ : textNum++;
          const color = getMappingColor(index, isImage);

          addEventListeners(o, {
            mousedown: this.handleMouseDown,
            mouseover: this.handleMouseOver,
            mouseout: this.handleMouseOut
          });

          o.set({ control });
          o.set({
            showOverlay: {
              color,
              isDisplayed: true,
              value: index
            }
          });
        });
      };

      // modify backround if render on a page
      if (this.isSingleLayout && isBackground(objects[0]))
        objects[0] = modifyBgToRenderOnPage(objects[0]);

      await drawObjectsOnCanvas(objects, this.canvas, preprocessingFunc);

      // without this timeout, canvas will blank on UI
      setTimeout(() => {
        this.updateThumbnails();
      }, 10);
    },
    handleMouseDown(e) {
      renderObjectOverlay(e.target);
      // renderImageCropControl(e.target);
      this.updateThumbnails();
    },
    handleMouseOver(e) {
      renderObjectOverlay(e.target);
    },
    handleMouseOut() {
      this.canvas.renderAll();
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

      // if (this.isPrint) {
      //   this.printPreview = [currWorkspace];
      // }
    }
  }
};
