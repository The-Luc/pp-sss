import { mapGetters, mapMutations } from 'vuex';
import { MUTATES } from '@/store/modules/app/const';

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
      themes: 'book/getThemes'
    })
  },
  methods: {
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL,
      selectTheme: 'book/selectTheme'
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
