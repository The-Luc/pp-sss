import {
  BORDER_STYLES,
  HTML_BORDER_STYLE,
  KEY_CODE,
  WINDOW_EVENT_TYPE
} from '@/common/constants';
import { isEmpty, mapObject } from '@/common/utils';

export default {
  props: {
    items: {
      type: Array,
      default: []
    },
    selectedItem: {
      type: Number | String,
      default: null
    }
  },
  data() {
    const tabs = [
      {
        label: 'Theme Styles',
        value: 'textStyles',
        items: []
      },
      {
        label: 'Saved Styles',
        value: 'savedStyles',
        items: []
      }
    ];

    return {
      tabs,
      tabActive: 0
    };
  },
  methods: {
    /**
     * Event fired when user choose an item on list
     *
     * @param {String}  index index of selected style
     */
    onChange(item) {
      if (isEmpty(item)) return;
      this.$emit('change', item);
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
          stroke: {
            name: 'border-color'
          },
          strokeWidth: {
            name: 'border-width',
            parse: value => `${Math.min(Math.ceil(value / 2), 20)}px`
          },
          strokeLineType: {
            name: 'border-style',
            parse: value => HTML_BORDER_STYLE[value] || value
          }
        },
        restrict: []
      };

      const styles = mapObject(cssStyle, mapRules);

      const { dropShadow, shadowAngle, shadowBlur, shadowColor, shadowOffset } =
        cssStyle?.shadow || {};

      const rad = (-Math.PI * (shadowAngle % 360)) / 180;

      const offsetX = parseInt(shadowOffset * Math.sin(rad), 10) / 3;
      const offsetY = parseInt(shadowOffset * Math.cos(rad), 10) / 3;
      const shadowStyle = dropShadow
        ? {
            'box-shadow': `${offsetX}px ${offsetY}px ${shadowBlur}px ${shadowColor}`
          }
        : 'none';

      const { strokeLineType, strokeWidth } = cssStyle?.border || {};

      const customBorder = {
        '--display': strokeLineType === BORDER_STYLES.DOUBLE ? 'block' : 'none',
        '--width': `${Math.max(Math.floor(strokeWidth / 8), 1)}px`
      };
      return { ...styles, ...shadowStyle, ...customBorder };
    },

    /**
     * Set selecbox items
     */
    setListItems() {
      const items = this.items.filter(item => !item.isCustom);
      const customItems = this.items.filter(item => item.isCustom);

      this.tabs[0].items = items;
      this.tabs[1].items = customItems;
    },
    /**
     * Event fire when pressed keyboard
     * @param {Event} event Event key up
     */
    onKeypress(event) {
      const key = event.keyCode || event.charCode;
      if (key === KEY_CODE.ESCAPE) {
        this.onChange();
      }
    }
  },
  beforeMount() {
    this.setListItems();
    const selected = this.items.find(
      item => String(item.id) === String(this.selectedItem)
    );
    this.tabActive = selected?.isCustom ? 1 : 0;
    window.document.addEventListener(WINDOW_EVENT_TYPE.KEY_UP, this.onKeypress);
  },
  beforeDestroy() {
    window.document.removeEventListener(
      WINDOW_EVENT_TYPE.KEY_UP,
      this.onKeypress
    );
  },
  watch: {
    items() {
      this.setListItems();
    }
  }
};
