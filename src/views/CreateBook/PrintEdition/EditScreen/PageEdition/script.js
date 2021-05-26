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
    window.printCanvas.setWidth(1200);
    window.printCanvas.setHeight(770);
  }
};
