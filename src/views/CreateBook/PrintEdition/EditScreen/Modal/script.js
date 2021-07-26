import { mapActions, mapGetters, mapMutations } from 'vuex';

import { MUTATES } from '@/store/modules/app/const';
import { MUTATES as PRINT_MUTATES } from '@/store/modules/print/const';
import {
  GETTERS as THEME_GETTERS,
  MUTATES as THEME_MUTATES,
  ACTIONS as THEME_ACTIONS
} from '@/store/modules/theme/const';
import Modal from '@/containers/Modal';
import PpButton from '@/components/Buttons/Button';
import Themes from './Themes';
import Preview from './Preview';
import { useLayoutPrompt } from '@/hooks';
import { loadLayouts } from '@/api/layouts';
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
      themes: THEME_GETTERS.GET_PRINT_THEMES,
      layouts: THEME_GETTERS.GET_PRINT_LAYOUTS_BY_THEME_ID
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
    ...mapActions({
      setPrintThemes: THEME_ACTIONS.GET_PRINT_THEMES
    }),
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL,
      setPrintLayouts: THEME_MUTATES.PRINT_LAYOUTS,
      selectTheme: PRINT_MUTATES.SET_DEFAULT_THEME_ID
    }),

    /**
     * Close Modal
     */
    onCloseModal() {
      this.toggleModal({
        isOpenModal: false
      });
    },
    /**
     * Set selected theme's id
     * @param  {Number} theme.themeId - Theme's id selected
     */
    onSelectTheme({ themeId }) {
      this.selectedThemeId = themeId;
    },
    /**
     * Set theme for print editor and close modal
     */
    onSubmitThemeId() {
      this.selectTheme({
        themeId: this.selectedThemeId
      });
      this.onCloseModal();
      this.openPrompt(EDITION.PRINT);
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
    }
  },
  async created() {
    if (this.themes.length === 0) {
      await this.setPrintThemes();
    }
    this.selectedThemeId = this.themes[0]?.id;
    if (this.layouts().length === 0) {
      const layouts = await loadLayouts();
      this.setPrintLayouts({
        layouts
      });
    }
  }
};
