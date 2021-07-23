import { EDITION } from '@/common/constants';

const noSheetSelectionGuard = (to, _, next, edition) => {
  const bookId = to.params?.bookId;

  next(`/book/${bookId}/edit/${edition}`);
};

export const printNoSheetSelectionGuard = (to, from, next) => {
  noSheetSelectionGuard(to, from, next, EDITION.PRINT);
};

export const digitalNoSheetSelectionGuard = (to, from, next) => {
  noSheetSelectionGuard(to, from, next, EDITION.DIGITAL);
};

export default { printNoSheetSelectionGuard, digitalNoSheetSelectionGuard };
