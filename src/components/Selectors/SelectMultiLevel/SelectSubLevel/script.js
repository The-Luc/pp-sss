import { ICON_LOCAL } from '@/common/constants';

export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    parentValue: {
      type: String | Number,
      default: ''
    },
    prependedIcon: {
      type: String,
      default: ''
    },
    appendedIcon: {
      type: String,
      default: ICON_LOCAL.ARROW_SELECT
    },
    activeMenuIcon: {
      type: String,
      default: ICON_LOCAL.ACTIVE_MENU
    },
    selectedVal: {
      type: Number | String,
      default: ''
    }
  },
  methods: {
    /**
     * Get option select after change and emit
     *
     * @param  {Object} option option selected
     */
    onSubClick(option) {
      this.$emit('change', { parent: this.parentValue, sub: option });
    },
    /**
     * Event fire when click on container, for stopping close selector
     *
     * @param {Object}  ev  the event
     */
    onSubContainerClick(ev) {
      ev.stopPropagation();
    },
    /**
     * Check if current item is selected
     *
     * @param   {Object}  item  current item
     * @returns {Boolean}       item is selected or not
     */
    isSelected(item) {
      return item.value === this.selectedVal;
    }
  }
};
