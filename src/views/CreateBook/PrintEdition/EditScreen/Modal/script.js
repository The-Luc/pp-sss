import { mapGetters, mapMutations } from 'vuex';

import { MUTATES } from '@/store/modules/app/const';
import { MUTATES as BOOK_MUTATES } from '@/store/modules/book/const';
import { GETTERS as THEME_GETTERS } from '@/store/modules/theme/const';
import Modal from '@/containers/Modal';
import PpButton from '@/components/Button';
import Themes from './Themes';
import Preview from './Preview';
import { useLayoutPrompt } from '@/hooks';

export default {
  setup() {
    const { openPrompt } = useLayoutPrompt();
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
      selectedThemeId: '',
      themePreview: null
    };
  },
  computed: {
    ...mapGetters({
      themes: THEME_GETTERS.GET_THEMES,
      layouts: THEME_GETTERS.GET_LAYOUTS
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
      selectTheme: BOOK_MUTATES.SELECT_THEME
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
     * @param  {Object} theme - Theme selected
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
      this.openPrompt();
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
    }
  },
  created() {
    this.selectedThemeId = this.themes[0]?.id;
  }
};
