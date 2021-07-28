import { mapMutations, mapGetters } from 'vuex';

import Modal from '@/containers/Modal';
import { useDrawLayout, useGetLayouts } from '@/hooks';
import { MUTATES as APP_MUTATES } from '@/store/modules/app/const';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import { EDITION, OBJECT_TYPE } from '@/common/constants';
import { pxToIn, resetObjects } from '@/common/utils';

export default {
  setup() {
    const { drawLayout } = useDrawLayout();
    const { updateSheetThemeLayout } = useGetLayouts(EDITION.PRINT);
    return {
      drawLayout,
      updateSheetThemeLayout
    };
  },
  components: {
    Modal
  },
  computed: {
    ...mapGetters({
      pageSelected: PRINT_GETTERS.CURRENT_SHEET,
      sheetLayout: PRINT_GETTERS.SHEET_LAYOUT
    }),
    numberPageLeft() {
      return this.$attrs.props.numberPageLeft;
    },
    numberPageRight() {
      return this.$attrs.props.numberPageRight;
    },
    sheetId() {
      return this.$attrs.props.sheetId;
    },
    themeId() {
      return this.$attrs.props.themeId;
    },
    layout() {
      return this.$attrs.props.layout;
    }
  },
  methods: {
    ...mapMutations({
      toggleModal: APP_MUTATES.TOGGLE_MODAL
    }),
    /**
     * Trigger mutation to close modal
     */
    closeModal() {
      this.toggleModal({
        isOpenModal: false
      });
    },
    /**
     * Trigger mutation to update single layout for sheet
     * @param  {String} pagePosition Left or right layout
     */
    updateSheet(pagePosition) {
      this.layout.objects = this.changeObjectsCoords(
        this.layout.objects,
        pagePosition
      );

      const zoom = window.printCanvas.getZoom();
      const width = window.printCanvas.width;
      const positionCenterX = pxToIn(width / zoom / 2);
      this.updateSheetThemeLayout({
        sheetId: this.sheetId,
        themeId: this.themeId,
        layout: this.layout,
        pagePosition,
        positionCenterX
      });
    },

    /**
     *  to change objects coords to fit the side that use what to render them
     * @param {Object} objects that will be change their coord to place in the right side (left/right)
     * @param {*} position left or right
     * @returns an object have coords changed
     */
    changeObjectsCoords(objects, position) {
      const { width } = window.printCanvas;
      const zoom = window.printCanvas.getZoom();
      const midCanvas = pxToIn(width / zoom / 2);

      objects.forEach(object => {
        if (object.type === OBJECT_TYPE.BACKGROUND) return;

        const left = object.coord.x;

        const isAddToLeft = position === 'right' && left < midCanvas;

        const isRemoveFromLeft = position === 'left' && left > midCanvas;

        const extraValue = isAddToLeft
          ? midCanvas
          : isRemoveFromLeft
          ? -midCanvas
          : 0;

        object.coord.x = left + extraValue;
      });

      return objects;
    },
    /**
     * Get sheet's layout and draw
     */
    drawLayoutSinglePage() {
      this.$root.$emit('drawLayout');
    },
    /**
     * Update layout to sheet, draw layout and then close modal
     * @param  {String} pagePosition Left or right layout
     */
    onUpdateLayoutSheet(pagePosition) {
      this.updateSheet(pagePosition);
      resetObjects(window.printCanvas);
      this.drawLayoutSinglePage();
      this.closeModal();
    },
    /**
     * Draw left layout when user click button from modal
     */
    onLeftClick() {
      this.onUpdateLayoutSheet('left');
    },
    /**
     * Draw right layout when user click button from modal
     */
    onRightClick() {
      this.onUpdateLayoutSheet('right');
    }
  }
};
