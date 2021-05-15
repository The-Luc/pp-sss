import { useGetters, useMutations } from 'vuex-composition-helpers';

import { useBook, useUpdateTitle } from '@/hooks';
import { GETTERS, MUTATES } from '@/store/modules/book/const';

export default {
  setup() {
    const { getBook, book } = useBook();
    const { updateTitle } = useUpdateTitle();
    const { bookId } = useGetters({
      bookId: GETTERS.BOOK_ID
    });
    const { mutateBook } = useMutations({
      mutateBook: MUTATES.GET_BOOK_SUCCESS
    });

    return {
      book,
      bookId,
      getBook,
      mutateBook,
      updateTitle
    };
  },
  data() {
    return {
      rootTitle: '',
      title: '',
      isCancel: false
    };
  },
  watch: {
    book: {
      deep: true,
      handler(book) {
        this.rootTitle = book.title;
        this.title = book.title;
      }
    }
  },
  mounted() {
    this.title = this.book.title;
    this.rootTitle = this.book.title;
  },
  methods: {
    onCancel() {
      this.title = this.rootTitle;
      this.isCancel = true;
      this.$refs.nameInput.blur();
    },
    onEnter() {
      this.$refs.nameInput.blur();
    },
    async onSubmit() {
      if (!this.title) {
        this.title = 'Untitled';
      }
      if (this.isCancel || this.title === this.rootTitle) {
        this.isCancel = false;
        return;
      }
      const { data, isSuccess } = await this.updateTitle(
        this.bookId,
        this.title.trim()
      );
      if (isSuccess) {
        this.book.title = data;
      }
    }
  }
};
