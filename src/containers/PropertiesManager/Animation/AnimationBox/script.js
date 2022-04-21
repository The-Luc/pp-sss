import { CONTROL_TYPE } from '@/common/constants';

export default {
  props: {
    type: {
      type: String
    },
    items: {
      type: Array,
      default: () => []
    },
    selectedItem: {
      type: String
    }
  },
  computed: {
    title() {
      return this.type === CONTROL_TYPE.PLAY_IN ? 'Play In' : 'Play Out';
    },

    isPlayOut() {
      return this.type === CONTROL_TYPE.PLAY_OUT;
    }
  },
  methods: {
    /**
     * Hanlde when click animation item
     * @param {String} id object's id
     */
    onClickItem(id) {
      this.$emit('click', id);
    }
  }
};
