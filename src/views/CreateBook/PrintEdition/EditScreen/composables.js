import { useMutationBook, useActionBook, useAppCommon } from '@/hooks';
import { GETTERS } from '@/store/modules/print/const';
import { useGetters } from 'vuex-composition-helpers';
import { useLoadStyles } from '@/views/CreateBook/composables';

export const useBookPrintInfo = () => {
  const { setBookInfo, setSectionsSheets } = useMutationBook();

  const { setGeneralInfo } = useAppCommon();

  const { getBookInfo } = useActionBook();

  const { loadStyles } = useLoadStyles();

  const { getBookInfo: printBookInfo } = useGetters({
    getBookInfo: GETTERS.GET_BOOK_INFO
  });

  const getBookPrintInfo = async bookId => {
    const { book, sections, sheets } = await getBookInfo(bookId, true);

    setSectionsSheets({ sections, sheets });

    const {
      id,
      communityId,
      themeId,
      pageInfo,
      isPhotoVisited,
      bookUserId,
      title,
      coverOption,
      numberMaxPages,
      totalPages
    } = book;

    setBookInfo({
      info: {
        id,
        communityId,
        defaultThemeId: themeId,
        pageInfo,
        bookUserId,
        isPhotoVisited,
        coverOption,
        numberMaxPages
      }
    });

    setGeneralInfo({ info: { bookId, title, totalPages } });
    await loadStyles();
  };

  return { getBookPrintInfo, printBookInfo };
};
