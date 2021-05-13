import book from '@/mock/book';

const bookService = {
  getBook: bookId => {
    return book;
  },
  updateTitle: (bookId, title) => ({
    data: title,
    isSuccess: true
  })
};

export default bookService;
