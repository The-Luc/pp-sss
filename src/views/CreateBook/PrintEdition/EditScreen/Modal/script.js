import { mapGetters, mapMutations } from 'vuex';
import { MUTATES } from '@/store/modules/app/const';

import Modal from '@/components/Modal';
import PpButton from '@/components/Button';

export default {
  components: {
    Modal,
    PpButton
  },
  data() {
    return {
      selectedThemeId: ''
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
      deleteSheet: 'book/deleteSheet'
    }),
    onCloseModal() {
      this.toggleModal({
        isOpenModal: false
      });
    },
    onDeleteSheet(idSheet, idSection) {
      this.deleteSheet({ idSheet, idSection });
      this.onCloseModal();
    },
    onSelectTheme(themeId) {
      this.selectedThemeId = themeId;
    }
  },
  created() {
    this.selectedThemeId = this.themes[0]?.id;
  }
};
