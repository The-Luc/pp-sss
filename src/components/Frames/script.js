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
      type: Number
    }
  },
  computed: {
    frameData() {
      const defaultData = [
        {
          image: '',
          type: null,
          id: null
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
    }
  }
};
