import { useMutationBook, useActionBook, useAppCommon } from '@/hooks';

export const useBookDigitalInfo = () => {
  const { setSectionsSheets } = useMutationBook();

  const { setGeneralInfo } = useAppCommon();

  const { getBookInfo } = useActionBook();

  const getBookDigitalInfo = async bookId => {
    const { book, sections, sheets } = await getBookInfo(bookId);

    setSectionsSheets({ sections, sheets });

    const { title, totalPage, totalSheet, totalScreen } = book;

    setGeneralInfo({
      info: { bookId, title, totalPage, totalSheet, totalScreen }
    });
  };

  return { getBookDigitalInfo };
};
