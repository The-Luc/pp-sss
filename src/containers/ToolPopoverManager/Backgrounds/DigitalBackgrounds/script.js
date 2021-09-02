import Backgrounds from '@/components/ToolPopovers/Background';

import { usePopoverCreationTool, useDigitalBackgroundMenu } from '@/hooks';

import { cloneDeep } from 'lodash';
import { isEmpty, getBackgroundType } from '@/common/utils';

export default {
  components: {
    Backgrounds
  },
  data() {
    return {
      backgroundTypes: {},
      backgrounds: [],
      noBackgroundLength: 4,
      selectedType: { sub: {} }
    };
  },
  setup() {
    const { setToolNameSelected } = usePopoverCreationTool();

    const {
      currentThemeId,
      userSelectedBackground,
      toggleModal,
      getBackgroundTypeData,
      getBackgroundData
    } = useDigitalBackgroundMenu();

    return {
      setToolNameSelected,
      currentThemeId,
      userSelectedBackground,
      toggleModal,
      getBackgroundTypeData,
      getBackgroundData
    };
  },
  computed: {
    appliedBackground() {
      return isEmpty(this.userSelectedBackground)
        ? {}
        : {
            ...this.userSelectedBackground,
            id: this.userSelectedBackground.backgroundId
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

      this.getBackgrounds();
    },
    /**
     * Get background data from API
     */
    async getBackgrounds() {
      this.backgrounds = await this.getBackgroundData(
        this.selectedType.value,
        this.selectedType.sub
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
