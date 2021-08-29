import PpSelect from '@/components/Selectors/Select';

export default {
  components: {
    PpSelect
  },
  props: {
    pages: {
      type: Array
    },
    currentPage: {
      type: Object,
      default: () => ({ name: '', value: '' })
    }
  },
  methods: {
    /**
     * Emit start page change to parent
     *
     * @param {Object}  page  selected page
     */
    onStartPageChange(page) {
      this.$emit('pageChange', { page });
    }
  }
};
