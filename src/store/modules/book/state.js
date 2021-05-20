import book from '@/mock/book';
import themes from '@/mock/themes';
import layouts from '@/mock/layouts';

const compare = (firstEl, secondEl) => {
  return firstEl.order - secondEl.order;
};

book.sections = book.sections.sort(compare);

book.sections.forEach(s => {
  s.sheets = s.sheets.sort(compare);
});

export const state = {
  book,
  themes,
  layouts
};
