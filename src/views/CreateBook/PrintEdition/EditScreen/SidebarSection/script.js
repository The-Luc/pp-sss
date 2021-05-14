import book from '@/mock/book';
import Thumbnail from '@/components/Thumbnail';
import HeaderContainer from './HeaderContainer'

export default {
  components: {
    Thumbnail,
    HeaderContainer
  },
  data() {
    return {
      book: book,
    };
  }
};
