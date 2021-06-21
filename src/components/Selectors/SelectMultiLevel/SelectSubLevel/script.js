import { ICON_LOCAL } from '@/common/constants';

export default {
  props: {
    items: {
      type: Object, // parent value & sub items
      required: true
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
      type: Object,
      default: () => this.getDefaultValue()
    }
  },
  computed: {
    displayItems() {
      return this.items.items;
    },
    selectedValue() {
      const selectedParentValue = this.selectedVal.parentValue.value;

      return selectedParentValue === this.items.parentValue.value
        ? this.selectedVal
        : this.getDefaultValue();
    }
  },
  methods: {
    /**
     * Get option select after change and emit
     *
     * @param  {Object} option option selected
     */
    onSubClick(option) {
      this.$emit('change', { parent: this.items.parentValue, sub: option });
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
      return item.value === this.selectedValue.value;
    },
    /**
     * Get default value of item
     *
     * @returns {Object} default value
     */
    getDefaultValue() {
      return { name: '', value: '', parentValue: { value: '' } };
    }
  }
};
