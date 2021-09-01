import PreviewThumbnail from '../../PreviewThumbnail';

export default {
  components: {
    PreviewThumbnail
  },
  props: {
    itemPerPage: {
      type: Number,
      default: 3
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentIndex: 0,
      pages: [[]]
    };
  },
  computed: {
    currentPage() {
      return this.pages[this.currentIndex];
    },
    contentCustomClass() {
      return this.currentPage.length === this.itemPerPage ? '' : 'not-full';
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
    onPageChange(index) {
      this.currentIndex = index;
    },
    /**
     * Get page data
     *
     * @returns {Array} page data
     */
    getPages() {
      const totalPage = Math.ceil(this.items.length / this.itemPerPage);

      return [...Array(totalPage).keys()].map(indPage => {
        const min = indPage * this.itemPerPage;
        const estimateMax = (indPage + 1) * this.itemPerPage - 1;

        const max =
          estimateMax >= this.items.length
            ? this.items.length - 1
            : estimateMax;

        return [...Array(max - min + 1).keys()].map(indItem => {
          return {
            item: this.items[indItem + min],
            index: indItem + min
          };
        });
      });
    }
  }
};
