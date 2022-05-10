import { ICON_LOCAL } from '@/common/constants';

export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    posX: {
      type: Number,
      required: true
    },
    posY: {
      type: Number,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      activeMenuIcon: ICON_LOCAL.ACTIVE_MENU_GRAY
    };
  },
  methods: {
    /**
     * Fire when user click to select a item on the list
     *
     * @param {Object}  item  selected community member
     */
    onSelected(item) {
      this.$emit('change', item);
    },
    /**
     * Fire when user click outside of assignee modal
     */
    onClickOutside() {
      console.log('on click out side');
      this.$emit('clickOutside');
    },
    onChange(e) {
      console.log('on change ', e);
      this.$emit('change', this.items[0]);
    }
  }
};
