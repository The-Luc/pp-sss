import Frames from './Frames';
import Thumbnail from '@/components//Thumbnail';
import book from '@/mock/book';
export default {
  components: {
    Frames,
    Thumbnail
  },
  data() {
    return {
      book: book
    };
  }
};
