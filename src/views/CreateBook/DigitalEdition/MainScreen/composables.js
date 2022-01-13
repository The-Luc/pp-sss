import { useMutationBook, useActionBook, useAppCommon } from '@/hooks';

export const useBookDigitalInfo = () => {
  const { setSectionsSheets } = useMutationBook();

  const { setGeneralInfo } = useAppCommon();

  const { getBookInfo } = useActionBook();

  const getBookDigitalInfo = async bookId => {
    const { book, sections, sheets } = await getBookInfo(bookId);

    setSectionsSheets({ sections, sheets });

    const { title, totalPages, totalSheets, totalScreens, communityId } = book;

    setGeneralInfo({
      info: {
        bookId,
        title,
        totalPages,
        totalSheets,
        totalScreens,
        communityId
      }
    });
  };

  return { getBookDigitalInfo };
};
