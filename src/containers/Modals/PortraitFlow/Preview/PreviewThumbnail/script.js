import { isEmpty } from '@/common/utils';

export default {
  props: {
    pages: {
      type: Array
    },
    currentPage: {
      type: Object,
      default: () => ({ name: '', value: '' })
    }
  },
  data() {
    return {
      selectedPage: this.currentPage?.value
    };
  },
  computed: {
    thumbUrl() {
      const page = this.pages.filter(({ value }) => {
        return this.selectedPage === value;
      });

      return isEmpty(page) ? '' : page.thumbUrl;
    }
  },
  watch: {
    currentPage: {
      deep: true,
      handler(newVal, oldVal) {
        if (JSON.stringify(newVal) === JSON.stringify(oldVal)) return;

        if (isEmpty(newVal?.value) || newVal.value <= this.selectedPage) return;

        this.selectedPage = newVal.value;
      }
    }
  },
  methods: {
    /**
     * Select last page
     */
    onMoveToLast() {
      if (this.selectedPage > this.pages[0].value) {
        this.selectedPage--;
      }
    },
    /**
     * Select next page
     */
    onMoveToNext() {
      const totalPage = this.pages.length;

      if (this.selectedPage < this.pages[totalPage - 1].value) {
        this.selectedPage++;
      }
    }
  }
};
