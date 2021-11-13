import { mapActions, mapGetters, mapMutations } from 'vuex';

import { MUTATES } from '@/store/modules/app/const';
import { MUTATES as PRINT_MUTATES } from '@/store/modules/print/const';
import {
  GETTERS as THEME_GETTERS,
  ACTIONS as THEME_ACTIONS
} from '@/store/modules/theme/const';
import Modal from '@/containers/Modals/Modal';
import PpButton from '@/components/Buttons/Button';
import Themes from './Themes';
import Preview from './Preview';
import { useLayoutPrompt } from '@/hooks';
import { EDITION } from '@/common/constants';
import { getPrintLayoutsPreviewApi } from '@/api/layout';

export default {
  components: {
    Modal,
    PpButton,
    Themes,
    Preview
  },
  setup() {
    const { openPrompt } = useLayoutPrompt(EDITION.PRINT);
    return {
      openPrompt
    };
  },
  data() {
    return {
      selectedThemeId: null,
      isPreviewing: false,
      layoutsOfThemePreview: null
    };
  },
  computed: {
    ...mapGetters({
      themes: THEME_GETTERS.GET_PRINT_THEMES
    }),
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
    async onPreviewTheme({ themeId }) {
      this.isPreviewing = true;
      if (
        themeId === this.selectedThemeId &&
        this.layoutsOfThemePreview != null
      )
        return;

      // clear previous layout
      this.layoutsOfThemePreview = [];

      this.selectedThemeId = themeId;
      this.layoutsOfThemePreview = await getPrintLayoutsPreviewApi(themeId);
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
  }
};
