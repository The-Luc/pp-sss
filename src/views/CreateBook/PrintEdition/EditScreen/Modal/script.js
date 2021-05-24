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
    onCloseModal() {
      this.toggleModal({
        isOpenModal: false
      });
    },
    onSelectTheme({ themeId }) {
      this.selectedThemeId = themeId;
    },
    onSubmitThemeId() {
      this.selectTheme({
        themeId: this.selectedThemeId
      });
      this.onCloseModal();
    },
    onPreviewTheme({ themeId }) {
      this.themePreview = themeId;
    }
  },
  created() {
    this.selectedThemeId = this.themes[0]?.id;
  }
};
