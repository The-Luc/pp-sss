import { isEmpty } from '@/common/utils';
import EmptyFrame from './EmptyFrame';
import FrameMenu from './FrameMenu';

export default {
  components: {
    EmptyFrame,
    FrameMenu
  },
  props: {
    frames: {
      type: Array
    },
    activeFrameId: {
      type: [String, Number]
    },
    showAddFrame: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isOpenMenu: false,
      menuX: 0,
      menuY: 0
    };
  },
  computed: {
    frameData() {
      const defaultData = [
        {
          id: 0,
          frame: {
            image: '',
            type: null,
            id: 0,
            fromLayout: true
          }
        }
      ];
      // if there are no frame => render default one
      if (isEmpty(this.frames)) return defaultData;

      // if there are only supplemental frames => render a blank frame at 1st position
      const hasTrueFrame = this.frames.some(f => f.frame.fromLayout);
      if (!hasTrueFrame) return [...defaultData, ...this.frames];

      return this.frames;
    }
  },
  methods: {
    /**
     * Fire when click add frame button
     * @param {Object} event mouse event parameter when click element
     */
    addFrame(event) {
      this.$emit('addFrame', event);
    },

    /**
     * To emeit to parent component
     * @param {Number} id Id of the clicked frame
     */
    onFrameClick(id) {
      this.$emit('onFrameClick', id);
    },

    /**
     * To toggle the option menu of a frame
     */
    onOptionClick(event) {
      this.isOpenMenu = true;

      const element = event.target;
      const { x, y } = element.getBoundingClientRect();
      this.menuX = x - 195;
      this.menuY = y - 205;
    },
    onCloseMenu() {
      this.isOpenMenu = false;
    },
    /**
     * Fire when click on Replace Layout button
     */
    onReplaceLayout() {
      const target = this.$refs[`frame-${this.activeFrameId}`][0];
      this.$emit('onReplaceLayout', { target, layoutId: this.activeFrameId });
      this.onCloseMenu();
    },
    /**
     * Fire when click on Delete layout button
     */
    onDeleteFrame() {
      this.$emit('onDeleteFrame', this.activeFrameId);
      this.onCloseMenu();
      //
    }
  }
};
