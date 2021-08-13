import { useMutationBook, useActionBook, useAppCommon } from '@/hooks';

export const useBookDigitalInfo = () => {
  const { setSectionsSheets } = useMutationBook(true);

  const { setGeneralInfo } = useAppCommon();

  const { getBookInfo } = useActionBook(true);

  const getBookDigitalInfo = async bookId => {
    const {
      title,
      totalPages,
      totalSheets,
      totalScreens,
      sectionsSheets
    } = await getBookInfo(bookId);

    setSectionsSheets({ sectionsSheets });

    setGeneralInfo({
      info: {
        bookId,
        title,
        totalPages,
        totalSheets,
        totalScreens
      }
    });
  };

  return {
    getBookDigitalInfo
  };
};
