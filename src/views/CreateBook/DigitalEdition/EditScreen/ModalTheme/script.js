import { mapGetters, mapMutations } from 'vuex';

import { MUTATES } from '@/store/modules/app/const';
import { MUTATES as DIGITAL_MUTATES } from '@/store/modules/digital/const';
import {
  GETTERS as THEME_GETTERS,
  MUTATES as THEME_MUTATES
} from '@/store/modules/theme/const';
import Modal from '@/containers/Modal';
import PpButton from '@/components/Buttons/Button';
import Themes from './Themes';
import Preview from './Preview';
import { loadDigitalThemes } from '@/api/themes';
import { loadDigitalLayouts } from '@/api/layouts';
import { useLayoutPrompt } from '@/hooks';
import { EDITION } from '@/common/constants';

export default {
  setup() {
    const { openPrompt } = useLayoutPrompt(EDITION.PRINT);
    return {
      openPrompt
    };
  },
  components: {
    Modal,
    PpButton,
    Themes,
    Preview
  },
  data() {
    return {
      selectedThemeId: null,
      isPreviewing: false
    };
  },
  computed: {
    ...mapGetters({
      themes: THEME_GETTERS.GET_DIGITAL_THEMES,
      layouts: THEME_GETTERS.GET_DIGITAL_LAYOUTS_BY_THEME_ID
    }),
    layoutsOfThemePreview() {
      return this.layouts(this.selectedThemeId);
    },
    themeNamePreview() {
      let name = '';
      if (this.isPreviewing) {
        name = this.themes.find(item => item.id == this.selectedThemeId).name;
      }
      return name;
    }
  },
  methods: {
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL,
      setDefaultThemId: DIGITAL_MUTATES.SET_DEFAULT_THEME_ID,
      setDigitalThemes: THEME_MUTATES.DIGITAL_THEMES,
      setDigitalLayouts: THEME_MUTATES.DIGITAL_LAYOUTS
    }),
    /**
     * Set selected theme's id
     * @param  {Number} theme.themeId - Theme's id selected
     */
    onSelectTheme({ themeId }) {
      this.selectedThemeId = themeId;
    },
    /**
     * Set preview theme's id
     * @param  {Number} theme.themeId - Theme's id preview
     */
    onPreviewTheme({ themeId }) {
      this.isPreviewing = true;
      this.selectedThemeId = themeId;
    },
    /**
     * Set preview theme's id empty and close preview
     */

    onClosePreview() {
      this.isPreviewing = false;
    },
    /**
     * Set theme for print editor and close modal
     */
    onSubmitThemeId() {
      this.setDefaultThemId({
        themeId: this.selectedThemeId
      });
      this.onCloseModal();
      this.openPrompt();
    },
    /**
     * Close Modal
     */
    onCloseModal() {
      this.toggleModal({
        isOpenModal: false
      });
    }
  },
  async created() {
    if (this.themes.length === 0) {
      const themes = await loadDigitalThemes();
      this.setDigitalThemes({
        themes
      });
    }
    this.selectedThemeId = this.themes[0]?.id;
    if (this.layouts().length === 0) {
      const layouts = await loadDigitalLayouts();
      this.setDigitalLayouts({
        layouts
      });
    }
  }
};
