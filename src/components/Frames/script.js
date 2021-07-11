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
            id: 0
          }
        }
      ];

      return isEmpty(this.frames) ? defaultData : this.frames;
    }
  },
  methods: {
    /**
     * Fire when click add frame button
     * @param {Object} event mouse event parameter when click element
     */
    addFrame(event) {
      console.log('add frame');
      console.log(event);
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
    onOptionClick(event, id) {
      this.isOpenMenu = true;

      const element = event.target;
      const { x, y } = element.getBoundingClientRect();
      this.menuX = x;
      this.menuY = y - 100;
      console.log(x, y);
    },
    onCloseMenu() {
      this.isOpenMenu = false;
    },
    onChangeLayout() {
      const target = this.$refs[`frame-${this.activeFrameId}`][0];
      this.$emit('addFrame', { target });
      this.onCloseMenu();
      //
    },
    onDeleteFrame() {
      this.$emit('deleteFrame');
      this.onCloseMenu();
      //
    }
  }
};
