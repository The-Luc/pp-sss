import Backgrounds from '@/components/Backgrounds';

import { MODAL_TYPES, BACKGROUND_PAGE_TYPE } from '@/common/constants';

import { usePopoverCreationTool, usePrintBackgroundMenu } from '@/hooks';

import { cloneDeep } from 'lodash';

import {
  isEmpty,
  isHalfSheet as isSheetHalfSheet,
  getBackgroundType,
  getBackgroundPageType
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
    const { setToolNameSelected } = usePopoverCreationTool();

    const {
      currentSheet,
      currentThemeId,
      userSelectedBackground,
      toggleModal,
      getBackgroundTypeData,
      getBackgroundData
    } = usePrintBackgroundMenu();

    return {
      setToolNameSelected,
      currentSheet,
      currentThemeId,
      userSelectedBackground,
      toggleModal,
      getBackgroundTypeData,
      getBackgroundData
    };
  },
  computed: {
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
    /**
     * Init data when loaded
     */
    async initData() {
      this.backgroundTypes = await this.getBackgroundTypeData();

      this.selectedType = getBackgroundType(
        this.appliedBackground,
        this.backgroundTypes,
        this.currentThemeId
      );

      this.selectedPageType = getBackgroundPageType(
        this.appliedBackground,
        this.isHalfSheet
      );

      this.getBackgrounds();
    },
    /**
     * Get background from API
     */
    async getBackgrounds() {
      this.backgrounds = await this.getBackgroundData(
        this.selectedType.value,
        this.selectedType.sub,
        this.selectedPageType.value
      );
    },
    /**
     * Event fire when choose background type
     *
     * @param {Object}  data  data of chosen background type
     */
    onChangeType(data) {
      this.selectedType = data;

      this.getBackgrounds();
    },
    /**
     * Event fire when choose background page type
     *
     * @param {Object}  data  data of chosen background page type
     */
    onChangePageType(data) {
      this.selectedPageType = data;

      this.getBackgrounds();
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
