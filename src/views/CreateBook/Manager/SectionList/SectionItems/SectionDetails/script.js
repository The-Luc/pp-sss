import { mapState, mapMutations } from 'vuex';
import { mapGetters } from 'vuex';
import draggable from 'vuedraggable';
import { MUTATES } from '@/store/modules/app/const';
import { MODAL_TYPES } from '@/common/constants';
import MenuDetail from './MenuDetail';
import ButtonDelete from '@/components/Menu/ButtonDelete';
import ICON_LOCAL from '@/common/constants/icon';

export default {
  data() {
    return {
      isOpen: false,
      items: [{ title: 'Move To', value: 'Choose a Section' }],
      isShowMenu: false,
      currentSheetId: '',
      currentSheetHover: '',
      moreIcon: ICON_LOCAL.MORE_ICON,
      arrowDown: ICON_LOCAL.ARROW_DOWN,
      isOpenMenu: false
    };
  },
  components: {
    draggable,
    MenuDetail,
    ButtonDelete
  },
  props: {
    sectionId: String,
    startSeq: Number
  },
  computed: {
    ...mapState('book', ['book']),
    ...mapGetters('book', ['getSections']),
    sheets: {
      get() {
        const section = this.book.sections.filter(s => s.id === this.sectionId);

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

    openModal(indexSheet, idSheet, idSection) {
      this.toggleModal({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.DELETE_SHEET,
          props: { indexSheet, idSheet, idSection }
        }
      });
    },
    setCurrentSheetId(id = '') {
      this.currentSheetHover = id;
    },
    onChangeStatusMenuDetail(id) {
      if (!this.currentSheetId) {
        this.currentSheetId = this.currentSheetHover;
        this.isShowMenu = !this.isShowMenu;
      } else {
        if (this.currentSheetId == id) {
          this.isShowMenu = !this.isShowMenu;
        } else {
          this.currentSheetId = this.currentSheetHover;
          this.isShowMenu = true;
        }
      }
    },
    onCloseMenu() {
      if (!this.currentSheetHover) {
        this.isShowMenu = false;
      }
    },
    onCheckIsShowMenuDetail(id) {
      return this.isShowMenu && this.currentSheetId == id;
    },
    onCheckActions(type) {
      const index = this.getSections.findIndex(
        item => item.id == this.sectionId
      );
      if (index == 0 || type == 'half') {
        return false;
      }
      return true;
    }
  }
};
