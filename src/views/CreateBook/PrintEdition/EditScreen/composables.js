import { useMutationBook, useActionBook, useAppCommon } from '@/hooks';
import { GETTERS } from '@/store/modules/print/const';
import { useGetters } from 'vuex-composition-helpers';
import { useText } from '@/views/CreateBook/composables';

export const useBookPrintInfo = () => {
  const { setBookInfo, setSectionsSheets } = useMutationBook();

  const { setGeneralInfo } = useAppCommon();

  const { getBookInfo } = useActionBook();

  const { setFontsToStore } = useText();

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
    setFontsToStore();
  };

  return { getBookPrintInfo, printBookInfo };
};
