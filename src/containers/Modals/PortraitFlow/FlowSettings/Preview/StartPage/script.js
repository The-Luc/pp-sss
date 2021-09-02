import PpSelect from '@/components/Selectors/Select';

import { isEmpty } from '@/common/utils';

export default {
  components: {
    PpSelect
  },
  props: {
    selectedPages: {
      type: Array
    },
    selectedPage: {
      type: Number
    }
  },
  computed: {
    page() {
      return { name: this.selectedPage, value: this.selectedPage };
    },
    pages() {
      return isEmpty(this.selectedPages)
        ? [{ name: 1, value: 1 }]
        : this.selectedPages.map(p => ({ name: p, value: p }));
    }
  },
  methods: {
    /**
     * Emit start page change to parent
     *
     * @param {Object}  page  selected page
     */
    onStartPageChange(page) {
      this.$emit('pageChange', { pageNo: page.value });
    }
  }
};
