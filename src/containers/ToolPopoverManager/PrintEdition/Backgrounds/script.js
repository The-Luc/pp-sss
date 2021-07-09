import Backgrounds from '@/components/Backgrounds';

import { mapGetters, mapMutations } from 'vuex';

import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';

import {
  MODAL_TYPES,
  BACKGROUND_TYPE,
  BACKGROUND_PAGE_TYPE,
  BACKGROUND_TYPE_NAME,
  STATUS
} from '@/common/constants';

import backgroundService from '@/api/background';
import themeService from '@/api/themes';

import { usePopoverCreationTool } from '@/hooks';

import { cloneDeep } from 'lodash';
import {
  isEmpty,
  isHalfSheet as isSheetHalfSheet,
  getBackgroundType,
  getBackgroundPageType,
  isOk
} from '@/common/utils';

export default {
  components: {
    Backgrounds
  },
  data() {
    return {
      backgroundTypes: {},
      backgrounds: [],
      noBackgroundLength: 4,
      selectedType: { sub: {} },
      selectedPageType: {}
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
    appliedBackground() {
      return isEmpty(this.userSelectedBackground)
        ? {}
        : {
            ...this.userSelectedBackground[0],
            id: this.userSelectedBackground[0].backgroundId
          };
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
     * Init data when loaded
     */
    async initData() {
      await this.getBackgroundTypeData();

      this.selectedType = getBackgroundType(
        this.appliedBackground,
        this.backgroundTypes,
        this.currentThemeId
      );

      this.selectedPageType = getBackgroundPageType(
        this.appliedBackground,
        this.isHalfSheet
      );

      this.getBackgroundData();
    },
    /**
     * Get background type data from API
     */
    async getBackgroundTypeData() {
      const [categories, themes] = await Promise.all([
        backgroundService.getCategories(),
        themeService.getThemes()
      ]);

      if (categories.status !== STATUS.OK || themes.status !== STATUS.OK) {
        return;
      }

      this.backgroundTypes = {
        [BACKGROUND_TYPE_NAME.THEME]: {
          id: BACKGROUND_TYPE.THEME.id,
          value: themes.data
        },
        [BACKGROUND_TYPE_NAME.CATEGORY]: {
          id: BACKGROUND_TYPE.CATEGORY.id,
          value: categories.data
        },
        [BACKGROUND_TYPE_NAME.CUSTOM]: {
          id: BACKGROUND_TYPE.CUSTOM.id,
          value: []
        },
        [BACKGROUND_TYPE_NAME.FAVORITE]: {
          id: BACKGROUND_TYPE.FAVORITE.id,
          value: []
        }
      };
    },
    /**
     * Get background data from API
     */
    async getBackgroundData() {
      const backgrounds = await backgroundService.getBackgrounds(
        this.selectedType.value,
        this.selectedType.sub,
        this.selectedPageType.value
      );

      this.backgrounds = isOk(backgrounds) ? backgrounds.data : [];
    },
    /**
     * Event fire when choose background type
     *
     * @param {Object}  data  data of chosen background type
     */
    onChangeType(data) {
      this.selectedType = data;

      this.getBackgroundData();
    },
    /**
     * Event fire when choose background page type
     *
     * @param {Object}  data  data of chosen background page type
     */
    onChangePageType(data) {
      this.selectedPageType = data;

      this.getBackgroundData();
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
    onApplyBackground(background) {
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
