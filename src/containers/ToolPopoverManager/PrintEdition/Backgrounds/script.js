import PpToolPopover from '@/components/ToolPopover';
import TypeSelection from '@/components/Backgrounds/TypeSelection';
import Item from '@/components/Backgrounds/Item';

import PageTypeSelection from './PageTypeSelection';

import { mapGetters, mapMutations } from 'vuex';

import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';

import {
  MODAL_TYPES,
  TOOL_NAME,
  BACKGROUND_TYPE,
  BACKGROUND_PAGE_TYPE
} from '@/common/constants';

import { usePopoverCreationTool } from '@/hooks';

import { cloneDeep } from 'lodash';
import { isEmpty, isHalfSheet as isSheetHalfSheet } from '@/common/utils';

import { themeOptions } from '@/mock/themes';
import { BACKGROUNDS, BACKGROUND_CATEGORIES } from '@/mock/backgrounds';

export default {
  components: {
    PpToolPopover,
    Item,
    TypeSelection,
    PageTypeSelection
  },
  data() {
    const backgroundTypes = Object.keys(BACKGROUND_TYPE).map(k => {
      const bgType = {
        ...BACKGROUND_TYPE[k],
        value: BACKGROUND_TYPE[k].id,
        subItems: []
      };

      if (BACKGROUND_TYPE[k].id === 0) {
        bgType.subItems = themeOptions;
      }

      if (BACKGROUND_TYPE[k].id === 1) {
        bgType.subItems = Object.keys(BACKGROUND_CATEGORIES).map(k => {
          return {
            ...BACKGROUND_CATEGORIES[k],
            value: BACKGROUND_CATEGORIES[k].id
          };
        });
      }

      return bgType;
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
  setup() {
    const { setToolNameSelected, selectedToolName } = usePopoverCreationTool();

    return {
      selectedToolName,
      setToolNameSelected
    };
  },
  computed: {
    ...mapGetters({
      currentSheet: PRINT_GETTERS.CURRENT_SHEET,
      currentThemeId: PRINT_GETTERS.DEFAULT_THEME_ID,
      userSelectedBackground: PRINT_GETTERS.BACKGROUNDS_NO_LAYOUT
    }),
    isHalfSheet() {
      return isSheetHalfSheet(this.currentSheet);
    },
    alreadyAppliedBackground() {
      return isEmpty(this.userSelectedBackground)
        ? {}
        : {
            ...this.userSelectedBackground[0],
            id: this.userSelectedBackground[0].backgroundId
          };
    },
    selectedBackgroundType() {
      if (!isEmpty(this.chosenBackgroundType)) {
        return this.chosenBackgroundType;
      }

      if (isEmpty(this.alreadyAppliedBackground)) {
        const sub = themeOptions.find(t => t.id === this.currentThemeId);

        return {
          ...BACKGROUND_TYPE.THEME,
          value: BACKGROUND_TYPE.THEME.id,
          sub
        };
      }

      const backgroundType = Object.keys(BACKGROUND_TYPE).find(
        k =>
          BACKGROUND_TYPE[k].id === this.alreadyAppliedBackground.backgroundType
      );

      if (isEmpty(backgroundType)) return { id: '' };

      return {
        ...BACKGROUND_TYPE[backgroundType],
        value: BACKGROUND_TYPE[backgroundType].id,
        sub: this.getSelectedBackgroundType(BACKGROUND_TYPE[backgroundType].id)
      };
    },
    selectedBackgroundPageType() {
      if (!isEmpty(this.chosenBackgroundPageType)) {
        return this.chosenBackgroundPageType;
      }

      if (isEmpty(this.alreadyAppliedBackground)) {
        const selectedBgPageType = this.isHalfSheet
          ? BACKGROUND_PAGE_TYPE.SINGLE_PAGE
          : BACKGROUND_PAGE_TYPE.FULL_PAGE;

        return {
          ...selectedBgPageType,
          value: selectedBgPageType.id
        };
      }

      const selectedBgPageType = Object.keys(BACKGROUND_PAGE_TYPE).find(k => {
        return (
          BACKGROUND_PAGE_TYPE[k].id === this.alreadyAppliedBackground.pageType
        );
      });

      if (!isEmpty(selectedBgPageType)) {
        return {
          ...BACKGROUND_PAGE_TYPE[selectedBgPageType],
          value: BACKGROUND_PAGE_TYPE[selectedBgPageType].id
        };
      }

      const selectedPageType = this.isHalfSheet
        ? BACKGROUND_PAGE_TYPE.SINGLE_PAGE
        : BACKGROUND_PAGE_TYPE.FULL_PAGE;

      return {
        ...selectedPageType,
        value: selectedPageType.id
      };
    },
    selectedBackground() {
      if (!isEmpty(this.chosenBackground)) {
        return this.chosenBackground;
      }

      if (!isEmpty(this.alreadyAppliedBackground)) {
        return this.alreadyAppliedBackground;
      }

      this.chosenBackground =
        this.backgrounds.length > 0 ? this.backgrounds[0] : { id: '' };

      return this.chosenBackground;
    },
    isDisablePageTypeSelection() {
      return this.isHalfSheet;
    },
    backgrounds() {
      return BACKGROUNDS.filter(b => {
        const { backgroundType, categoryId, pageType } = b;

        if (backgroundType !== this.selectedBackgroundType.id) return false;

        if (categoryId !== this.selectedBackgroundType.sub.id) return false;

        return pageType === this.selectedBackgroundPageType.id;
      });
    }
  },
  watch: {
    selectedToolName(val) {
      if (val === TOOL_NAME.BACKGROUNDS) this.initData();
    },
    currentSheet: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal.id !== oldVal.id) {
          this.initData();
        }
      }
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    ...mapMutations({
      toggleModal: APP_MUTATES.TOGGLE_MODAL
    }),
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
      if (backgroundTypeId === BACKGROUND_TYPE.THEME.id) {
        return themeOptions.find(
          t => t.id === this.alreadyAppliedBackground.categoryId
        );
      }

      if (backgroundTypeId === BACKGROUND_TYPE.CATEGORY.id) {
        const category = Object.keys(BACKGROUND_CATEGORIES).find(
          k =>
            BACKGROUND_CATEGORIES[k].id ===
            this.alreadyAppliedBackground.categoryId
        );

        return {
          ...BACKGROUND_CATEGORIES[category],
          value: BACKGROUND_CATEGORIES[category].id
        };
      }

      // TODO: Custom & Favorite
      return null;
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
     * Trigger hooks to set tool name is empty and then close popover when click Cancel button
     */
    onClose() {
      this.setToolNameSelected('');
    },
    /**
     * Trigger mutation to set Background
     */
    applyChosenBackground() {
      const { pageType: selectedPageType } = this.selectedBackground;

      const isSinglePageType =
        selectedPageType === BACKGROUND_PAGE_TYPE.SINGLE_PAGE.id;

      if (!this.isHalfSheet && isSinglePageType) {
        this.toggleModal({
          isOpenModal: true,
          modalData: {
            type: MODAL_TYPES.BACKGROUND_SELECT_PAGE,
            props: {
              numberPageLeft: this.currentSheet.pageLeftName,
              numberPageRight: this.currentSheet.pageRightName,
              background: {
                ...cloneDeep(this.selectedBackground),
                opacity: 1
              }
            }
          }
        });

        this.onClose();

        return;
      }

      this.$root.$emit('printAddBackground', {
        background: {
          ...cloneDeep(this.selectedBackground),
          opacity: 1
        },
        isLeft: true
      });

      this.onClose();
    }
  }
};
