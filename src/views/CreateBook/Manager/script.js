import SectionList from './SectionList';
import Summary from './Summary';

import { useManager } from '@/views/CreateBook/Manager/composables';

export default {
  components: {
    SectionList,
    Summary
  },
  setup() {
    const { getBook } = useManager();

    return { getBook };
  },
  created() {
    this.getBook({ bookId: this.$route.params.bookId });
  }
};
