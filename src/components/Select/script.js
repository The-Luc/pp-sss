import { isEmpty } from '@/common/utils';

import { ICON_LOCAL } from '@/common/constants';

export default {
  props: {
    items: {
      type: Array,
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
      default: () => ({})
    },
    disabled: {
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
    onChange(option) {
      this.$emit('change', option);
    },
    /**
     * Get css style of item base on its style
     *
     * @param   {Object} style  style of item
     * @returns {Object}         css style of item
     */
    getStyle(cssStyle) {
      if (isEmpty(cssStyle)) return {};

      const style = {};

      Object.keys(cssStyle).forEach(k => {
        if (k !== 'fontSize') {
          style[k] = cssStyle[k];

          return;
        }

        const fontSize = parseInt(cssStyle[k], 10) / 3;

        style[k] = `${fontSize > 50 ? 50 : fontSize}px`;
      });

      return style;
    }
  }
};
