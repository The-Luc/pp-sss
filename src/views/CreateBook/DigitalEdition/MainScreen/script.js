import { mapGetters } from 'vuex';

import Frames from '@/components/Thumbnail/Frames';
import Thumbnail from '@/components/Thumbnail/ThumbnailDigital';
import book from '@/mock/book';
import { GETTERS } from '@/store/modules/book/const';

export default {
  components: {
    Frames,
    Thumbnail
  },
  computed: {
    ...mapGetters({
      bookId: GETTERS.BOOK_ID
    })
  },
  data() {
    return {
      book: book
    };
  },
  methods: {}
};
