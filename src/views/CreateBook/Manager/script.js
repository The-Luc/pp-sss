import { useGetters } from 'vuex-composition-helpers';

import SectionList from './SectionList';
import Summary from './Summary';

import { GETTERS } from '@/store/modules/book/const';

export default {
  setup() {
    const { book } = useGetters({
      book: GETTERS.BOOK_DETAIL
    });
    return {
      book
    };
  },
  components: {
    SectionList,
    Summary
  }
};
