import { mapGetters } from 'vuex';

import DragDropControl from '@/components/DragDropControl';
import DragDropIndicator from '@/components/DragDropIndicatorVertical';
import ButtonDelete from '@/components/Menu/ButtonDelete';
import MenuDetail from '../MenuDetail';

import ICON_LOCAL from '@/common/constants/icon';

import { GETTERS } from '@/store/modules/book/const';
import { MODAL_TYPES } from '@/common/constants';
import { SHEET_TYPES } from '@/common/constants/sheetTypes';

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
      type: Number,
      require: true
    },
    sheet: {
      type: Object,
      require: true
    }
  },
  setup() {
    return {
      ...mapGetters({
        getSections: GETTERS.SECTIONS
      })
    };
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
      sheetTypes: SHEET_TYPES
    };
  },
  methods: {
    isHalfSheet: function() {
      return (
        this.sheet.type === this.sheetTypes.INTRO ||
        this.sheet.type === this.sheetTypes.SIGNATURE
      );
    },
    showDragControl: function(evt) {
      if (evt.target.getAttribute('data-draggable') !== 'true') {
        return;
      }

      this.$root.$emit('showDragControl', 'sheet' + this.sheet.id);
    },
    hideDragControl: function() {
      this.$root.$emit('hideDragControl');
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
        this.sheetTypes.COVER,
        this.sheetTypes.INTRO,
        this.sheetTypes.SIGNATURE
      ];

      return restrictSheetTypes.indexOf(this.sheet.type) < 0;
    },
    getSectionsForMove() {
      return this.getSections().map(s => {
        return {
          id: s.id,
          name: s.name,
          order: s.order,
          color: s.color
        };
      });
    }
  }
};
