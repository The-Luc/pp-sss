import { mapGetters, mapMutations } from 'vuex';
import { MUTATES } from '@/store/modules/app/const';
import {
  GETTERS as BOOK_GETTERS,
  MUTATES as BOOK_MUTATES
} from '@/store/modules/book/const';

import Modal from '@/components/Modal';
import PpButton from '@/components/Button';
import Themes from './Themes';
import Preview from './Preview';

export default {
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
      themes: BOOK_GETTERS.GET_THEMES
    })
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
    },
    /**
     * Set preview theme's id
     * @param  {Object} theme - Theme preview
     * @param  {Number} theme.themeId - Theme's id preview
     */
    onPreviewTheme({ themeId }) {
      this.themePreview = themeId;
    }
  },
  created() {
    this.selectedThemeId = this.themes[0]?.id;
  }
};
