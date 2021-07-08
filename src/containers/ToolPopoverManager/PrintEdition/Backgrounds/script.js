import Backgrounds from '@/components/Backgrounds';

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
    Backgrounds
  },
  data() {
    const backgroundTypes = {
      THEME: {
        id: BACKGROUND_TYPE.THEME.id,
        value: cloneDeep(themeOptions)
      },
      CATEGORY: {
        id: BACKGROUND_TYPE.CATEGORY.id,
        value: cloneDeep(BACKGROUND_CATEGORIES)
      },
      CUSTOM: {
        id: BACKGROUND_TYPE.CUSTOM.id,
        value: []
      },
      FAVORITE: {
        id: BACKGROUND_TYPE.FAVORITE.id,
        value: []
      }
    };

    return {
      backgroundTypes,
      noBackgroundLength: 4,
      selectedBackgroundType: { sub: {} },
      selectedBackgroundPageType: {}
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
    backgrounds() {
      return BACKGROUNDS.filter(b => {
        const { backgroundType, categoryId, pageType } = b;

        if (backgroundType !== this.selectedBackgroundType.id) return false;

        if (categoryId !== this.selectedBackgroundType.sub.id) return false;

        return pageType === this.selectedBackgroundPageType.id;
      });
    }
  },
  methods: {
    ...mapMutations({
      toggleModal: APP_MUTATES.TOGGLE_MODAL
    }),
    /**
     * Event fire when choose background type
     *
     * @param {Object}  data  data of chosen background type
     */
    onChangeType(data) {
      this.selectedBackgroundType = data;
    },
    /**
     * Event fire when choose background page type
     *
     * @param {Object}  data  data of chosen background page type
     */
    onChangePageType(data) {
      this.selectedBackgroundPageType = data;
    },
    /**
     * Trigger hooks to set tool name is empty and then close popover when click Cancel button
     */
    onClose() {
      this.setToolNameSelected('');
    },
    /**
     * Trigger mutation to set Background
     *
     * @param {Object}  background  selected background
     */
    onApplyChosenBackground(background) {
      const { pageType: selectedPageType } = background;

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
                ...cloneDeep(background),
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
          ...cloneDeep(background),
          opacity: 1
        },
        isLeft: true
      });

      this.onClose();
    }
  }
};
