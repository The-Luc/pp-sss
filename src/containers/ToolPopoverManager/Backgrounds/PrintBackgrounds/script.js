import Backgrounds from '@/components/ToolPopovers/Background';

import { MODAL_TYPES } from '@/common/constants';

import {
  useAppCommon,
  usePopoverCreationTool,
  usePrintBackgroundMenu
} from '@/hooks';

import { cloneDeep } from 'lodash';

import {
  isHalfSheet as isSheetHalfSheet,
  getBackgroundType,
  getBackgroundPageType,
  isFullBackground,
  isHalfRight
} from '@/common/utils';

export default {
  components: {
    Backgrounds
  },
  setup() {
    const { setToolNameSelected } = usePopoverCreationTool();

    const {
      currentSheet,
      currentThemeId,
      toggleModal,
      getBackgroundTypeData,
      getBackgroundData
    } = usePrintBackgroundMenu();
    const { setNotification } = useAppCommon();

    return {
      setToolNameSelected,
      currentSheet,
      currentThemeId,
      toggleModal,
      getBackgroundTypeData,
      getBackgroundData,
      setNotification
    };
  },
  data() {
    return {
      backgroundTypes: {},
      backgrounds: [],
      noBackgroundLength: 4,
      selectedType: { sub: '' },
      selectedPageType: {},
      appliedBackground: {}
    };
  },
  computed: {
    isHalfSheet() {
      return isSheetHalfSheet(this.currentSheet);
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
      if (!this.selectedType.sub) {
        this.selectedType.sub = this.backgroundTypes.THEME.value[0].id;
        const notification = {
          isShow: true,
          type: 'warning',
          title: 'Warning',
          text: 'Please select a theme for this book'
        };
        this.setNotification({ notification });
      }
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

      const isSinglePageType = !isFullBackground({
        pageType: selectedPageType
      });

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

      const isLeft = !isHalfRight(this.currentSheet);

      this.$root.$emit('printAddBackground', {
        background: {
          ...cloneDeep(background),
          opacity: 1
        },
        isLeft
      });

      this.onClose();
    }
  }
};
