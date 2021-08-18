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
      sectionsSheets
    } = await getBookInfo(bookId);

    setBookInfo({ info: { defaultThemeId: themeId, pageInfo } });

    setSectionsSheets({ sectionsSheets });

    setGeneralInfo({
      info: {
        bookId,
        title,
        isPhotoVisited
      }
    });
  };

  return {
    getBookPrintInfo
  };
};
