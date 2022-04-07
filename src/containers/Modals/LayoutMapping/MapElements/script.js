import { fabric } from 'fabric';
import { cloneDeep } from 'lodash';
import {
  drawObjectsOnCanvas,
  isBackground,
  isSingleLayout,
  modifyBgToRenderOnPage,
  resetObjects,
  isEmpty
} from '@/common/utils';
import CommonModal from '@/components/Modals/CommonModal';
import PreviewItem from './PreviewItem';
import { DIGITAL_CANVAS_SIZE, PRINT_CANVAS_SIZE } from '@/common/constants';

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
  setup() {
    return {};
  },
  data() {
    return {
      idOfActiveImage: null,
      canvas: null
    };
  },
  computed: {
    printPreview() {
      const id = this.printLayout.id;
      const previewImageUrl = this.printLayout.previewImageUrl;

      return [{ id, previewImageUrl }];
    },
    digitalPreview() {
      const frames = this.digitalLayout?.frames || [];
      return frames.map(f => ({
        id: f.id,
        previewImageUrl: f.previewImageUrl
      }));
    },
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

      const preprocessingFunc = fbObjects => {
        fbObjects.forEach(o => {
          o.set({ selectable: false });
        });
      };

      // modify backround if render on a page
      if (this.isSingleLayout && isBackground(objects[0]))
        objects[0] = modifyBgToRenderOnPage(objects[0]);

      await drawObjectsOnCanvas(objects, this.canvas, preprocessingFunc);
    }
  }
};
