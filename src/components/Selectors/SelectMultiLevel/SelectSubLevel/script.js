import { ICON_LOCAL } from '@/common/constants';
import { getRefElement, isEmpty } from '@/common/utils';

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
    isOpen: {
      type: Boolean,
      default: false
    },
    position: {
      type: Object,
      default: () => ({ x: 0, y: 0 })
    },
    activator: {
      type: String
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

      const activeCss = value === subValue ? 'v-list-item--active' : '';

      return [activeCss, this.getDataIdByValue(value)];
    },
    /**
     * Get sub level 2 value of selected item
     *
     * @param   {Object}  item  current item
     * @returns {String}        sub value
     */
    getSelectedSub(item) {
      return item.value === this.selectedVal.value ? this.selectedVal.sub : '';
    },
    /**
     * Check submenu is existed
     *
     * @returns {Boolean} is existed
     */
    isSubmenuExisted(item) {
      return !isEmpty(item.subItems);
    },
    /**
     * Get data id of the item
     *
     * @param   {Object}  item  current item
     * @returns {String}        the data id
     */
    getDataIdByValue(value) {
      return `select-sub-${value}`;
    },
    getSubmenuPosition(item) {
      const elementDataId = this.getDataIdByValue(item.value);

      const element = getRefElement(this.$refs, elementDataId);

      if (isEmpty(element)) return { x: 0, y: 0 };

      const { x, y, width } = element.getBoundingClientRect();

      const margin = -3;

      return { x: x + width + margin, y };
    }
  }
};
