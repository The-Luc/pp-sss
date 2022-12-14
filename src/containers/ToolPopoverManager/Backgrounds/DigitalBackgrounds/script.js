import Backgrounds from '@/components/ToolPopovers/Background';

import { cloneDeep } from 'lodash';

import { getBackgroundType } from '@/common/utils';

import {
  usePopoverCreationTool,
  useDigitalBackgroundMenu,
  useBackgroundGetter,
  useAppCommon
} from '@/hooks';

export default {
  components: {
    Backgrounds
  },
  setup() {
    const { setToolNameSelected } = usePopoverCreationTool();

    const {
      currentThemeId,
      toggleModal,
      getBackgroundTypeData,
      getBackgroundData
    } = useDigitalBackgroundMenu();
    const { setNotification } = useAppCommon();

    const { backgrounds: appliedBackground } = useBackgroundGetter();

    return {
      setToolNameSelected,
      currentThemeId,
      toggleModal,
      getBackgroundTypeData,
      getBackgroundData,
      appliedBackground,
      setNotification
    };
  },
  data() {
    return {
      backgroundTypes: {},
      backgrounds: [],
      noBackgroundLength: 4,
      selectedType: { sub: {} }
    };
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
        {}, //this.appliedBackground,
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

      this.getBackgrounds();
    },
    /**
     * Get background data from API
     */
    async getBackgrounds() {
      this.backgrounds = await this.getBackgroundData(
        this.selectedType.value,
        this.selectedType.sub,
        null // it's needed
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
      this.$root.$emit('digitalAddBackground', {
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
