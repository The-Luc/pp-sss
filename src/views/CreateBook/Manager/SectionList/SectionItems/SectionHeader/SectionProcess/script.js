import { mapMutations, mapGetters } from 'vuex';

import ICON_LOCAL from '@/common/constants/icon';
import Menu from '@/components/Menu';
import ButtonDelete from '@/components/Menu/ButtonDelete';
import { MUTATES } from '@/store/modules/app/const';
import { MODAL_TYPES } from '@/common/constants';

export default {
  props: ['color', 'releaseDate', 'sectionId', 'sectionName'],
  components: {
    Menu,
    ButtonDelete
  },
  data() {
    return {
      items: [
        { title: 'Status', value: 'Not Started' },
        { title: 'Due Date', value: 'Due Date' },
        { title: 'Assigned To', value: 'Unassigned' }
      ],
      moreIcon: ICON_LOCAL.MORE_ICON
    };
  },
  computed: {
    ...mapGetters('book', ['getSections']),
    isShowDelete() {
      const index = this.getSections.findIndex(
        item => item.id === this.sectionId
      );
      if (index !== 0 && index !== 1 && index !== this.getSections.length - 1) {
        return true;
      }
      return false;
    }
  },
  methods: {
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL
    }),
    onOpenModal(sectionId, sectionName) {
      this.toggleModal({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.DELETE_SECTION,
          props: { sectionId, sectionName }
        }
      });
    }
  }
};
