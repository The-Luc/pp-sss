import book from '@/mock/book';

const compare = (firstEl, secondEl) => {
  return firstEl.order - secondEl.order;
};

book.sections = book.sections.sort(compare);

book.sections.forEach(s => {
  s.sheets = s.sheets.sort(compare);
});
const pageSelected = book.sections[0].sheets[0].id;

export const state = {
  book,
  pageSelected,
  sectionId: 1,
  isOpenProperties: false,
  selectedObjectType: '',
  textProperties: {
    bold: false,
    fontStyle: false,
    underLine: false,
    fontFamily: 'arial',
    fontSize: '60',
    textAlign: ''
  }
};
