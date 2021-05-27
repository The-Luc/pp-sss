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
  methods: {
    // addLine(a, b, c, d, color) {
    //   let horizontal = new fabric.Line([a, b, c, d], {
    //     stroke: color,
    //     strokeWidth: 1,
    //     selectable: false
    //   });
    //   window.printCanvas.add(horizontal);
    // }
  },
  mounted() {
    let el = this.$refs.canvas;
    window.printCanvas = new fabric.Canvas(el);
    window.printCanvas.setWidth(1205);
    window.printCanvas.setHeight(768);
    // this.addLine(86, 70, 86, 698, '#27AAE1');
    // this.addLine(86, 70, 570, 70, '#27AAE1');
    // this.addLine(570, 70, 570, 698, '#27AAE1');
    // this.addLine(86, 698, 570, 698, '#27AAE1');

    // this.addLine(1205 - 86, 70, 1205 - 86, 698, '#27AAE1');
    // this.addLine(1205 - 86, 70, 1205 - 570, 70, '#27AAE1');
    // this.addLine(1205 - 570, 70, 1205 - 570, 698, '#27AAE1');
    // this.addLine(1205 - 86, 698, 1205 - 570, 698, '#27AAE1');

    // this.addLine(60, 45, 60, 768 - 60, '#27AAE1');
    // this.addLine(1205 - 86, 70, 1205 - 570, 70, '#27AAE1');
    // this.addLine(1205 - 570, 70, 1205 - 570, 698, '#27AAE1');
    // this.addLine(1205 - 86, 698, 1205 - 570, 698, '#27AAE1');
  }
};
