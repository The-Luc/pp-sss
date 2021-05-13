import { mapState, mapMutations } from 'vuex';

import draggable from 'vuedraggable';
import { MUTATES } from '@/store/modules/app/const';
import { MODAL_TYPES } from '@/common/constants';
import Menu from '@/components/Menu';
import ButtonDelete from '@/components/Menu/ButtonDelete';
import ICON_LOCAL from '@/common/constants/icon';

export default {
  data() {
    return {
      isOpen: false,
      items: [
        { title: 'Move To', value: 'Choose a Section' }
      ],
      moreIcon : ICON_LOCAL.MORE_ICON
    };
  },
  components: {
    draggable,
    Menu,
    ButtonDelete
  },
  props: {
    sectionId: String,
    startSeq: Number
  },
  computed: {
    ...mapState('book', ['book']),
    sheets: {
      get() {
        const section = this.book.sections.filter(
          s => s.id === this.sectionId
        );

        return section == null || section.length == 0 ? [] : section[0].sheets;
      },
      set(newSheets) {
        this.updateSection({
          sectionId: this.sectionId,
          sheets: newSheets
        });
      }
    }
  },
  methods: {
    ...mapMutations('book', ['updateSection']),
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL
    }),
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;

      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      );
    },

    openModal(idSheet, idSection) {
      this.toggleModal({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.DELETE_SHEET,
          props: { idSheet, idSection }
        }
      });
    }
  }
};
