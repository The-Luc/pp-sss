import PpToolPopover from '../ToolPopover';

import TypeSelection from './TypeSelection';
import PageTypeSelection from './PageTypeSelection';
import Item from './Item';

import {
  isEmpty,
  getDisplayBackgroundTypes,
  getDisplayBackgroundPageTypes,
  autoScroll
} from '@/common/utils';

export default {
  components: {
    PpToolPopover,
    Item,
    TypeSelection,
    PageTypeSelection
  },
  props: {
    backgroundTypes: {
      type: Object,
      default: () => ({})
    },
    backgrounds: {
      type: Array,
      default: () => []
    },
    selectedType: {
      type: Object,
      required: true
    },
    selectedPageType: {
      type: Object,
      required: true
    },
    appliedBackground: {
      type: Object,
      default: () => ({})
    },
    isPageTypeDisabled: {
      type: Boolean,
      default: false
    },
    isPageTypeHidden: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      displayBackgroundPageType: getDisplayBackgroundPageTypes(),
      chosenBackground: {},
      noBackgroundLength: 4
    };
  },
  computed: {
    displayBackgroundTypes() {
      return getDisplayBackgroundTypes(this.backgroundTypes);
    },
    selectedBackground() {
      if (!isEmpty(this.chosenBackground)) {
        return this.chosenBackground;
      }

      this.chosenBackground =
        this.backgrounds.length > 0 ? this.backgrounds[0] : { id: '' };

      return this.chosenBackground;
    }
  },
  watch: {
    backgrounds: {
      immediate: true,
      handler() {
        autoScroll(
          this.$refs,
          `background${this.appliedBackground?.id}`,
          this.$refs.container ? this.$refs.container.parentElement : null
        );
      }
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    /**
     * Set up inital data to render in view
     */
    initData() {
      this.chosenBackground = {};
    },
    /**
     * Event fire when choose background type
     *
     * @param {Object}  data  data of chosen background type
     */
    onChangeBackgroundType(data) {
      this.$emit('typeChange', {
        value: data.value,
        sub: data.sub?.value
      });
    },
    /**
     * Event fire when choose background page type
     *
     * @param {Object}  data  data of chosen background page type
     */
    onChangeBackgroundPageType(data) {
      this.$emit('pageTypeChange', data);
    },
    /**
     * Event fire when choose background
     *
     * @param {Object}  data  data of chosen background
     */
    onSelectBackground(data) {
      this.chosenBackground = data;
    },
    /**
     * Close menu
     */
    onClose() {
      this.$emit('close');
    },
    /**
     * Trigger mutation to set Background
     */
    onApplyChosenBackground() {
      this.$emit('applyBackground', this.selectedBackground);

      this.onClose();
    }
  }
};
