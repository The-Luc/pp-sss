import { useMutationBook, useActionBook, useAppCommon } from '@/hooks';

export const useBookPrintInfo = () => {
  const { setBookInfo, setSectionsSheets } = useMutationBook();

  const { setGeneralInfo } = useAppCommon();

  const { getBookInfo } = useActionBook();

  const getBookPrintInfo = async bookId => {
    const { book, sections, sheets } = await getBookInfo(bookId, true);

    setSectionsSheets({ sections, sheets });

    const {
      themeId,
      pageInfo,
      isPhotoVisited,
      title,
      coverOption,
      numberMaxPages
    } = book;

    setBookInfo({
      info: {
        defaultThemeId: themeId,
        pageInfo,
        isPhotoVisited,
        coverOption,
        numberMaxPages
      }
    });

    setGeneralInfo({ info: { bookId, title } });
  };

  return { getBookPrintInfo };
};
