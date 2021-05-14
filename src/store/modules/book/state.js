import book from '@/mock/book';

const compare = (firstEl, secondEl) => {
  return firstEl.order - secondEl.order;
};

book.sections = book.sections.sort(compare);

book.sections.forEach(s => {
  s.sheets = s.sheets.sort(compare);
});

export const state = {
  book: book
};
