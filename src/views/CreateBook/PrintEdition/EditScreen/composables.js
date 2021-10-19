import { useMutationBook, useActionBook, useAppCommon } from '@/hooks';

export const useBookPrintInfo = () => {
  const { setBookInfo, setSectionsSheets } = useMutationBook();

  const { setGeneralInfo } = useAppCommon();

  const { getBookInfo } = useActionBook();

  const getBookPrintInfo = async bookId => {
    const {
      themeId,
      pageInfo,
      isPhotoVisited,
      title,
      sectionsSheets,
      coverOption,
      numberMaxPages
    } = await getBookInfo(bookId, true);

    setBookInfo({ info: { defaultThemeId: themeId, pageInfo } });

    setSectionsSheets({ sectionsSheets });

    setGeneralInfo({
      info: {
        bookId,
        title,
        isPhotoVisited,
        coverOption,
        numberMaxPages
      }
    });
  };

  return {
    getBookPrintInfo
  };
};
