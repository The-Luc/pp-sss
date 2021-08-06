import { isEmpty, mapObject } from '@/common/utils';

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
    getStyle(cssStyle) {
      if (isEmpty(cssStyle)) return {};

      const mapRules = {
        data: {
          fontSize: {
            name: 'fontSize',
            parse: value => {
              const fontSize = parseInt(value, 10) / 3;

              return `${fontSize > 50 ? 50 : fontSize}px`;
            }
          }
        },
        restrict: []
      };

      return mapObject(cssStyle, mapRules);
    },

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
      event.target.blur();
    }
  }
};
