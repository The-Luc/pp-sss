import { ICON_LOCAL } from '@/common/constants';
import { isEmpty } from '@/common/utils';

export default {
  name: 'SubLevel',
  props: {
    items: {
      type: Array,
      required: true
    },
    parentValue: {
      type: [String, Number],
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
      type: [String, Number, Object],
      default: ''
    },
    isSubmenuIconDisplayed: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * Get option select after change and emit
     *
     * @param  {Object} option option selected
     */
    onSubClick(option) {
      if (!isEmpty(option.subItems)) {
        return;
      }
      this.$emit('change', { value: this.parentValue, sub: option });
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
      return typeof this.selectedVal === 'object'
        ? item.value === this.selectedVal.value
        : item.value === this.selectedVal;
    },
    /**
     * Get disabled css class name
     *
     * @param   {Boolean} isDisabled  disable status of item
     * @param   {Object}  value       value of item
     * @returns {String}              custom css class name
     */
    getCustomCssClass({ isDisabled, value }) {
      if (isDisabled) return 'disabled';
      const subValue =
        typeof this.selectedVal === 'object'
          ? this.selectedVal.value
          : this.selectedVal;
      return value === subValue ? 'v-list-item--active' : '';
    },
    /**
     * Get sub level 2 value of selected item
     *
     * @param   {Object}  item  current item
     * @returns {String}        sub value
     */
    getSelectedSub(item) {
      return item.value === this.selectedVal.value ? this.selectedVal.sub : '';
    }
  }
};
