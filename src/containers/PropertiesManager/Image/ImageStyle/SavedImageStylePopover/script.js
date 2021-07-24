import {
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
      type: Number,
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
            parse: value => (value > 10 ? '10px' : value + 'px')
          },
          strokeLineType: {
            name: 'border-style',
            parse: value => HTML_BORDER_STYLE[value] || value
          }
        },
        restrict: []
      };

      return mapObject(cssStyle, mapRules);
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
    const selected = this.items.find(item => item.id === this.selectedItem);
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
