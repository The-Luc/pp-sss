import SlideItem from './SlideItem';
import TheNavigator from './TheNavigator';

export default {
  components: {
    SlideItem,
    TheNavigator
  },
  props: {
    flowSettings: {
      type: Object,
      default: () => ({})
    },
    items: {
      type: Array,
      default: () => []
    },
    isDigital: {
      type: Boolean
    }
  },
  data() {
    return {
      itemPerPage: this.isDigital ? 4 : 3,
      itemPerRow: this.isDigital ? 2 : 3,
      currentIndex: 0,
      pages: [[[]]]
    };
  },
  computed: {
    currentPage() {
      return this.pages[this.currentIndex];
    },
    isPosibleToBack() {
      return this.currentIndex > 0;
    },
    isPosibleToNext() {
      return this.currentIndex < this.pages.length - 1;
    }
  },
  mounted() {
    this.pages = this.getPages();
  },
  methods: {
    /**
     * Next page
     */
    onNext() {
      if (this.currentIndex > this.pages.length - 2) return;

      this.currentIndex++;
    },
    /**
     * Previous page
     */
    onBack() {
      if (this.currentIndex < 1) return;

      this.currentIndex--;
    },
    /**
     * Move to selected page
     *
     * @param {Number}  index index of selected page
     */
    onPageChange({ index }) {
      this.currentIndex = index;
    },
    /**
     * Get page data
     *
     * @returns {Array} page data
     */
    getPages() {
      const totalItem = this.items.length;

      const totalPage = Math.ceil(totalItem / this.itemPerPage);

      return [...Array(totalPage).keys()].map(indPage => {
        const minInPage = indPage * this.itemPerPage;
        const estimateMaxInPage = (indPage + 1) * this.itemPerPage - 1;

        const maxInPage =
          estimateMaxInPage >= totalItem ? totalItem - 1 : estimateMaxInPage;

        const totalRow = Math.ceil(
          (maxInPage - minInPage + 1) / this.itemPerRow
        );

        return [...Array(totalRow).keys()].map(indRow => {
          const minInRow = indRow * this.itemPerRow + minInPage;
          const estimateMaxInRow =
            (indRow + 1) * this.itemPerRow + minInPage - 1;

          const maxInRow =
            estimateMaxInRow >= totalItem ? totalItem - 1 : estimateMaxInRow;

          return [...Array(maxInRow - minInRow + 1).keys()].map(indItem => {
            return {
              item: this.items[indItem + minInRow],
              index: indItem + minInRow
            };
          });
        });
      });
    },
    hasFullItem(totalItem) {
      return totalItem === this.itemPerRow;
    }
  }
};
