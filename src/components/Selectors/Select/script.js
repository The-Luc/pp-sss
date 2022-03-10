import { isEmpty } from '@/common/utils';
import { getCssTextStyle } from '@/common/utils/text';

import { ICON_LOCAL } from '@/common/constants';

export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    itemVal: {
      type: String,
      default: 'value'
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
      default: () => ({ name: '', value: '' })
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isImgOpts: {
      type: Boolean,
      default: false
    },
    container: {
      type: String
    },
    placeholder: {
      type: String
    },
    dataContainer: {
      type: String
    }
  },
  methods: {
    /**
     * Get option select after change and emit
     *
     * @param  {Object} option option selected
     */
    onChange(option) {
      this.$emit('change', option);
    },
    /**
     * Get css style of item base on its style
     *
     * @param   {Object} style  style of item
     * @returns {Object}        css style of item
     */
    getStyle: getCssTextStyle,

    /**
     * Fire when click event
     * @param {Element} event element has clicked
     */
    onClick(event) {
      this.$emit('click', event);
    },
    /**
     * To unfocus an input
     */
    onFocus(event) {
      if (isEmpty(event?.target)) return;

      event.target.blur();
    }
  }
};
