import { mapState, mapMutations } from 'vuex';

import draggable from 'vuedraggable';
import { MUTATES } from '@/store/modules/app/const';
import { MODAL_TYPES } from '@/common/constants';

export default {
  data() {
    return {
      isOpen: false
    };
  },
  components: {
    draggable
  },
  props: {
    sectionId: String,
    startSeq: Number
  },
  computed: {
    ...mapState('project', ['project']),
    sheets: {
      get() {
        const section = this.project.sections.filter(
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
    ...mapMutations('project', ['updateSection']),
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

    openModal() {
      this.toggleModal({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.DELETE_SHEET
        }
      });
    }
  }
};
