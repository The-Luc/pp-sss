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
    onClickOutside(e) {
      // handle case that user click on a part of the dropdown but not on any item
      const target = e?.target;

      if (!target || !target.classList.contains('v-list')) return;

      this.$emit('change', null);
    }
  }
};
