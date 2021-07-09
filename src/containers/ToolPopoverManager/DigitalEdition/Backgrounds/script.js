import Backgrounds from '@/components/Backgrounds';

import { mapGetters, mapMutations } from 'vuex';

import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';
import { GETTERS as DIGITAL_GETTERS } from '@/store/modules/digital/const';

import {
  BACKGROUND_TYPE,
  BACKGROUND_TYPE_NAME,
  STATUS
} from '@/common/constants';

import backgroundService from '@/api/background';
import themeService from '@/api/themes';

import { usePopoverCreationTool } from '@/hooks';

import { cloneDeep } from 'lodash';
import { isEmpty, getBackgroundType, isOk } from '@/common/utils';

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

    return { setToolNameSelected };
  },
  computed: {
    ...mapGetters({
      currentThemeId: DIGITAL_GETTERS.DEFAULT_THEME_ID,
      userSelectedBackground: DIGITAL_GETTERS.BACKGROUNDS_NO_LAYOUT
    }),
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

      this.getBackgroundData();
    },
    /**
     * Get background type data from API
     */
    async getBackgroundTypeData() {
      const [categories, themes] = await Promise.all([
        backgroundService.getDigitalCategories(),
        themeService.getDigitalThemes()
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
      const backgrounds = await backgroundService.getDigitalBackgrounds(
        this.selectedType.value,
        this.selectedType.sub
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
