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
     * @returns {Array}         css style of item
     */
    getStyle(style) {
      if (isEmpty(style)) return [];

      const styles = {};

      Object.keys(style).forEach(k => {
        const value = style[k];

        if (k === 'fontSize') {
          styles[k] = `${value / 4}pt`;

          return;
        }

        if (k === 'isBold') {
          styles['fontWeight'] = value ? 'bold' : 'normal';

          return;
        }

        if (k === 'isItalic') {
          styles['fontStyle'] = value ? 'italic' : 'normal';

          return;
        }

        if (k === 'isUnderline') {
          styles['textDecoration'] = value ? 'underline' : 'none';

          return;
        }

        styles[k] = value;
      });

      return styles;
    }
  }
};
