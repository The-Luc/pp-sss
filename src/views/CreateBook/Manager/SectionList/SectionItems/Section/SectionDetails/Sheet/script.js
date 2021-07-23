import DragDropControl from '@/components/DragDrops/DragDropControl';
import DragDropIndicator from '@/components/DragDrops/DragDropIndicatorVertical';
import ButtonDelete from '@/components/Menu/ButtonDelete';
import MenuDetail from '../MenuDetail';

import { mapGetters, mapMutations } from 'vuex';

import { ICON_LOCAL, MODAL_TYPES, SHEET_TYPE } from '@/common/constants';
import { MUTATES } from '@/store/modules/app/const';
import { GETTERS } from '@/store/modules/book/const';

import { isEmpty } from '@/common/utils';

export default {
  components: {
    DragDropControl,
    DragDropIndicator,
    MenuDetail,
    ButtonDelete
  },
  props: {
    sequence: {
      type: Number,
      require: true
    },
    sectionId: {
      type: [Number, String],
      require: true
    },
    sheet: {
      type: Object,
      require: true
    },
    dragTargetType: {
      type: String
    }
  },
  data() {
    return {
      isOpen: false,
      items: [{ title: 'Move To', value: 'Choose a Section' }],
      isShowMenu: false,
      currentSheetId: '',
      currentSheetHover: '',
      moreIcon: ICON_LOCAL.MORE_ICON,
      arrowDown: ICON_LOCAL.ARROW_DOWN,
      isOpenMenu: false,
      isDragControlDisplayed: false
    };
  },
  computed: {
    ...mapGetters({
      sections: GETTERS.SECTIONS
    }),
    dragTargetCssClass() {
      return isEmpty(this.dragTargetType)
        ? ''
        : `drag-target-${this.dragTargetType}`;
    }
  },
  methods: {
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL
    }),
    isHalfSheet: function() {
      return (
        this.sheet.type === SHEET_TYPE.FRONT_COVER ||
        this.sheet.type === SHEET_TYPE.BACK_COVER
      );
    },
    /**
     * Show the drag control when hover & draggable
     */
    showDragControl() {
      this.isDragControlDisplayed = this.sheet.draggable;
    },
    /**
     * Hide the drag control when mouse out
     */
    hideDragControl() {
      this.isDragControlDisplayed = false;
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
    onCheckActions() {
      const restrictSheetTypes = [
        SHEET_TYPE.COVER,
        SHEET_TYPE.FRONT_COVER,
        SHEET_TYPE.BACK_COVER
      ];

      return restrictSheetTypes.indexOf(this.sheet.type) < 0;
    },
    getSectionsForMove() {
      return this.sections.filter((item, index) => {
        return index !== 0 && item.id != this.sectionId;
      });
    }
  }
};
