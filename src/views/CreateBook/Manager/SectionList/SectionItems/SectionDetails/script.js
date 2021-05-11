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
      isShowMenu: false,
      currentSheetId: '',
      moreIcon: ICON_LOCAL.MORE_ICON,
      arrowDown: ICON_LOCAL.ARROW_DOWN,
      isOpenMenu: false
      // config: {
      //   handler: this.test3,
      //   events: ["dblclick", "click"]
      // }
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

    openModal(idSheet, idSection) {
      this.toggleModal({
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.DELETE_SHEET,
          props: { idSheet, idSection }
        }
      });
    },
    onCheckIsShowMenu(id) {
      return this.currentSheetId == id;
    },
    setCurrentSheetId(id = '') {
      if (!this.isShowMenu) {
        this.currentSheetId = id;
      }
    },
    onChangeStatusMenuDetail() {
      this.isShowMenu = !this.isShowMenu
    },
    onCloseMenu() {
      this.isShowMenu = false;
      this.setCurrentSheetId();
    },
    onCheckIsShowMenuDetail(id) {
      return (this.isShowMenu && this.currentSheetId == id);
    }
  }
};
