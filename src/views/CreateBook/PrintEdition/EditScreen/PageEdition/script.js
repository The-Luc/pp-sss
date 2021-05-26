import { mapGetters } from 'vuex';
import { fabric } from 'fabric';
import { GETTERS } from '@/store/modules/book/const';
export default {
  computed: {
    ...mapGetters({
      book: GETTERS.BOOK_DETAIL,
      pageSelected: GETTERS.GET_PAGE_SELECTED
    }),
    isHardCover() {
      const { coverOption, sections } = this.book;
      return (
        coverOption === 'Hardcover' &&
        this.pageSelected === sections[0].sheets[0].id
      );
    },
    isSoftCover() {
      const { coverOption, sections } = this.book;
      return (
        coverOption === 'Softcover' &&
        this.pageSelected === sections[0].sheets[0].id
      );
    },
    isIntro() {
      const { sections } = this.book;
      return this.pageSelected === sections[1].sheets[0].id;
    },
    isSignature() {
      const { sections } = this.book;
      const lastSection = sections[sections.length - 1];
      return (
        this.pageSelected ===
        lastSection.sheets[lastSection.sheets.length - 1].id
      );
    }
  },
  mounted() {
    let el = this.$refs.canvas;
    window.printCanvas = new fabric.Canvas(el);
    fabric.Object.prototype.cornerColor = '#fff';
    fabric.Object.prototype.borderColor = '#8C8C8C';
    fabric.Object.prototype.borderSize = 1.25;
    fabric.Object.prototype.cornerSize = 9;
    fabric.Object.prototype.cornerStrokeColor = '#8C8C8C';
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.borderScaleFactor = 1.5;
    fabric.Object.prototype.setControlsVisibility({
      mtr: false // I think you get it
    });
    window.printCanvas.setWidth(1200);
    window.printCanvas.setHeight(770);
  }
};
