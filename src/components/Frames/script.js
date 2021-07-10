import { isEmpty } from '@/common/utils';
import EmptyFrame from './EmptyFrame';

export default {
  components: {
    EmptyFrame
  },
  props: {
    frames: {
      type: Array
    },
    activeFrameId: {
      type: [String, Number]
    }
  },
  computed: {
    frameData() {
      const defaultData = [
        {
          image: '',
          type: null,
          id: 0
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
      this.$emit('addFrame', event);
    },

    /**
     * To emeit to parent component
     * @param {Number} id Id of the clicked frame
     */
    onFrameClick(id) {
      this.$emit('onFrameClick', id);
    }
  }
};
