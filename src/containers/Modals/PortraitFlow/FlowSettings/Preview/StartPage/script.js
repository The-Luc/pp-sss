import PpSelect from '@/components/Selectors/Select';

export default {
  components: {
    PpSelect
  },
  props: {
    selectedPages: {
      type: Array
    },
    selectedPage: {
      type: Object
    },
    isDigital: {
      type: Boolean
    },
    containerName: {
      type: String
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
