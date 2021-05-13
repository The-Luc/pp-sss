import book from '@/mock/book';

const bookService = {
  getBook: bookId => {
    return book;
  },
  updateTitle: (bookId, title) => ({
    data: title,
    isSuccess: true
  }),
  updateSection: (bookId, sectionId, data) => {
    return {
      isSuccess: true,
      data: {
        bookId,
        sectionId,
        data
      }
    };
  }
};

export default bookService;
