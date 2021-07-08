import PpToolPopover from '../ToolPopover';
import TypeSelection from './TypeSelection';
import PageTypeSelection from './PageTypeSelection';
import Item from './Item';

import { BACKGROUND_TYPE, BACKGROUND_PAGE_TYPE } from '@/common/constants';

import { isEmpty } from '@/common/utils';

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
      default: () => {
        const types = {};

        Object.keys(BACKGROUND_TYPE).forEach(k => {
          types[k] = { id: BACKGROUND_TYPE[k].id, value: [] };
        });

        return types;
      }
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
    isHalfSheet: {
      type: Boolean,
      default: false
    },
    isPageTypeHidden: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const backgroundTypes = Object.keys(BACKGROUND_TYPE).map(k => {
      return {
        ...BACKGROUND_TYPE[k],
        value: BACKGROUND_TYPE[k].id,
        subItems: this.backgroundTypes[k].value
      };
    });

    const displayBackgroundTypes = backgroundTypes.filter(
      b => b.subItems.length > 0
    );

    const displayBackgroundPageType = Object.keys(BACKGROUND_PAGE_TYPE).map(
      k => {
        return {
          ...BACKGROUND_PAGE_TYPE[k],
          value: BACKGROUND_PAGE_TYPE[k].id
        };
      }
    );

    return {
      displayBackgroundTypes,
      displayBackgroundPageType,
      chosenBackground: {},
      noBackgroundLength: 4
    };
  },
  computed: {
    selectedBackground() {
      if (!isEmpty(this.chosenBackground)) {
        return this.chosenBackground;
      }

      if (!isEmpty(this.appliedBackground)) {
        return this.appliedBackground;
      }

      this.chosenBackground =
        this.backgrounds.length > 0 ? this.backgrounds[0] : { id: '' };

      return this.chosenBackground;
    },
    isPageTypeDisabled() {
      return this.isHalfSheet;
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
     * Get selected background type data by type id
     *
     * @param   {String}  backgroundTypeId  background type id
     * @returns {Object}                    the background data
     */
    getSelectedBackgroundType(backgroundTypeId) {
      const selectType = Object.keys(this.backgroundTypes).find(k => {
        return this.backgroundTypes[k].id === backgroundTypeId;
      });

      return this.backgroundTypes[selectType].value.find(
        v => v.id === this.appliedBackground.categoryId
      );
    },
    /**
     * Event fire when choose background type
     *
     * @param {Object}  data  data of chosen background type
     */
    onChangeBackgroundType(data) {
      this.$emit('typeChange', {
        value: data.parent,
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
