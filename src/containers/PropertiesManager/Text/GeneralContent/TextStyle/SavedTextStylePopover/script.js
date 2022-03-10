import { KEY_CODE, WINDOW_EVENT_TYPE } from '@/common/constants';
import { scrollToElement } from '@/common/utils';
import { getCssTextStyle } from '@/common/utils/text';

export default {
  props: {
    items: {
      type: Array,
      default: []
    },
    selectedVal: {
      type: Object,
      default: () => ({ name: '', id: '' })
    }
  },
  data() {
    const tabs = [
      {
        label: 'Text Styles',
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
      tabActive: 0,
      selectedItem: null
    };
  },
  methods: {
    /**
     * Event fired when user choose an item on list
     *
     * @param {String}  index index of selected style
     */
    onChange(index) {
      if (!index) this.onTabChange(this.tabActive);
      const tab = this.tabs[this.tabActive];
      const items = tab.items;
      const selectedStyle = items[index];
      this.$emit('change', selectedStyle || {});
    },

    /**
     * Get css style of item base on its style
     *
     * @param   {Object} style  style of item
     * @returns {Object}        css style of item
     */
    getStyle: getCssTextStyle,

    /**
     * Event fired when user choose an item on list
     *
     * @param {String}  index index of selected style
     */
    onTabChange(index) {
      this.tabActive = index;
      const items = this.tabs[this.tabActive].items;
      this.selectedItem = items.findIndex(
        item => item.id === this.selectedVal?.id
      );
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
    const tabActive = this.selectedVal?.isCustom ? 1 : 0;
    this.onTabChange(tabActive);
    window.document.addEventListener(WINDOW_EVENT_TYPE.KEY_UP, this.onKeypress);
  },
  mounted() {
    const el = this.$refs[`style${this.selectedVal?.id}`]?.[0]?.$el;
    if (el) {
      scrollToElement(el);
    }
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
