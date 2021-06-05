import DragDropControl from '@/components/DragDropControl';
import DragDropIndicator from '@/components/DragDropIndicatorVertical';
import ButtonDelete from '@/components/Menu/ButtonDelete';
import MenuDetail from '../MenuDetail';

import { mapGetters, mapMutations } from 'vuex';

import { ICON_LOCAL, MODAL_TYPES, SHEET_TYPES } from '@/common/constants';
import { MUTATES } from '@/store/modules/app/const';
import { GETTERS } from '@/store/modules/book/const';

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
      isOpenMenu: false
    };
  },
  computed: {
    ...mapGetters({
      sections: GETTERS.SECTIONS
    })
  },
  methods: {
    ...mapMutations({
      toggleModal: MUTATES.TOGGLE_MODAL
    }),
    isHalfSheet: function() {
      return (
        this.sheet.type === SHEET_TYPES.FRONT_COVER ||
        this.sheet.type === SHEET_TYPES.BACK_COVER
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
        SHEET_TYPES.COVER,
        SHEET_TYPES.FRONT_COVER,
        SHEET_TYPES.BACK_COVER
      ];

      return restrictSheetTypes.indexOf(this.sheet.type) < 0;
    },
    getSectionsForMove() {
      return this.sections.map(s => {
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
