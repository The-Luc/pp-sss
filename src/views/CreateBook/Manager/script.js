import SectionList from './SectionList';
import Summary from './Summary';

import book from '@/mock/book';

export default {
  components: {
    SectionList,
    Summary
  },
  data() {
    return {
      book: book
    };
  }
};
