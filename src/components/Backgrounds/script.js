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
    themeId: {
      type: Number | String,
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
      chosenBackgroundType: {},
      chosenBackgroundPageType: {},
      chosenBackground: {},
      noBackgroundLength: 4
    };
  },
  computed: {
    selectedBackgroundType() {
      if (!isEmpty(this.chosenBackgroundType)) {
        this.$emit('typeChange', this.chosenBackgroundType);

        return this.chosenBackgroundType;
      }

      if (isEmpty(this.appliedBackground)) {
        const defaultType = {
          ...BACKGROUND_TYPE.THEME,
          value: BACKGROUND_TYPE.THEME.id,
          sub: this.backgroundTypes.THEME.value.find(
            ({ id }) => id === this.themeId
          )
        };

        this.$emit('typeChange', defaultType);

        return defaultType;
      }

      const backgroundType = Object.keys(BACKGROUND_TYPE).find(
        k => BACKGROUND_TYPE[k].id === this.appliedBackground.backgroundType
      );

      if (isEmpty(backgroundType)) return { id: '' };

      const type = {
        ...BACKGROUND_TYPE[backgroundType],
        value: BACKGROUND_TYPE[backgroundType].id,
        sub: this.getSelectedBackgroundType(BACKGROUND_TYPE[backgroundType].id)
      };

      this.$emit('typeChange', type);

      return type;
    },
    selectedBackgroundPageType() {
      if (!isEmpty(this.chosenBackgroundPageType)) {
        this.$emit('pageTypeChange', this.chosenBackgroundPageType);

        return this.chosenBackgroundPageType;
      }

      if (isEmpty(this.appliedBackground)) {
        const selectedBgPageType = this.isHalfSheet
          ? BACKGROUND_PAGE_TYPE.SINGLE_PAGE
          : BACKGROUND_PAGE_TYPE.FULL_PAGE;

        const defaultPageType = {
          ...selectedBgPageType,
          value: selectedBgPageType.id
        };

        this.$emit('pageTypeChange', defaultPageType);

        return defaultPageType;
      }

      const selectedBgPageType = Object.keys(BACKGROUND_PAGE_TYPE).find(k => {
        return BACKGROUND_PAGE_TYPE[k].id === this.appliedBackground.pageType;
      });

      if (!isEmpty(selectedBgPageType)) {
        const selected = {
          ...BACKGROUND_PAGE_TYPE[selectedBgPageType],
          value: BACKGROUND_PAGE_TYPE[selectedBgPageType].id
        };

        this.$emit('pageTypeChange', selected);

        return selected;
      }

      const selectedPageType = this.isHalfSheet
        ? BACKGROUND_PAGE_TYPE.SINGLE_PAGE
        : BACKGROUND_PAGE_TYPE.FULL_PAGE;

      const selected = {
        ...selectedPageType,
        value: selectedPageType.id
      };

      this.$emit('pageTypeChange', selected);

      return selected;
    },
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
      this.chosenBackgroundType = {};
      this.chosenBackgroundPageType = {};
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
      this.chosenBackgroundType = {
        ...data.item,
        sub: data.sub
      };
    },
    /**
     * Event fire when choose background page type
     *
     * @param {Object}  data  data of chosen background page type
     */
    onChangeBackgroundPageType(data) {
      this.chosenBackgroundPageType = data;
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
