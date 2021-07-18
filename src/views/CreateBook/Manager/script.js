import SectionList from './SectionList';
import Summary from './Summary';

import { useManager } from '@/hooks/manager';

export default {
  components: {
    SectionList,
    Summary
  },
  setup() {
    const { setBookId, getBook } = useManager();

    return {
      setBookId,
      getBook
    };
  },
  created() {
    this.setBookId({ bookId: this.$route.params.bookId });

    this.getBook();
  }
};
