import { mapActions, mapGetters, mapMutations } from 'vuex';

import { MUTATES } from '@/store/modules/app/const';
import { MUTATES as DIGITAL_MUTATES } from '@/store/modules/digital/const';
import {
  GETTERS as THEME_GETTERS,
  MUTATES as THEME_MUTATES,
  ACTIONS as THEME_ACTIONS
} from '@/store/modules/theme/const';
import Modal from '@/containers/Modal';
import PpButton from '@/components/Buttons/Button';
import Themes from './Themes';
import Preview from './Preview';
import { loadDigitalThemes } from '@/api/themes';
import { loadDigitalLayouts } from '@/api/layouts';

export default {
  components: {
    Modal,
    PpButton,
    Themes,
    Preview
  },
  data() {
    return {
      selectedThemeId: null,
      themePreview: null
    };
  },
  computed: {
    ...mapGetters({
      themes: THEME_GETTERS.GET_DIGITAL_THEMES,
      layouts: THEME_GETTERS.GET_DIGITAL_LAYOUTS_BY_THEME_ID
    }),
    layoutsOfThemePreview() {
      return this.layouts(this.themePreview);
    },
    themeNamePreview() {
      let name = '';
      if (this.themePreview) {
        name = this.themes.find(item => item.id == this.themePreview).name;
      }
      return name;
    }
  },
  methods: {
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL,
      selectDefaultThemId: DIGITAL_MUTATES.DEFAULT_THEME_ID,
      setDigitalThemes: THEME_MUTATES.DIGITAL_THEMES,
      setDigitalLayouts: THEME_MUTATES.DIGITAL_LAYOUTS
    }),
    /**
     * Set selected theme's id
     * @param  {Object} theme - Theme selected
     * @param  {Number} theme.themeId - Theme's id selected
     */
    onSelectTheme({ themeId }) {
      this.selectedThemeId = themeId;
    },
    /**
     * Set preview theme's id
     * @param  {Object} theme - Theme preview
     * @param  {Number} theme.themeId - Theme's id preview
     */
    onPreviewTheme({ themeId }) {
      this.themePreview = themeId;
      this.selectedThemeId = themeId;
    },
    /**
     * Set preview theme's id empty and close preview
     */
    onClosePreview() {
      this.themePreview = null;
    },
    /**
     * Set theme for print editor and close modal
     */
    onSubmitThemeId() {
      this.selectDefaultThemId({
        themeId: this.selectedThemeId
      });
      this.onCloseModal();
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
