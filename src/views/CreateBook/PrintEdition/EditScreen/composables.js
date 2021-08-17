import { useMutationBook, useActionBook, useAppCommon } from '@/hooks';
import { getPhotos, searchPhotos } from '@/api/photo';

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

export const useGetPhotos = () => {
  const getSmartboxPhotos = async keywords => {
    const listPhotos = await getPhotos(keywords);
    return listPhotos;
  };

  const getSearchPhotos = async input => {
    const listPhotos = await searchPhotos(input);
    return listPhotos;
  };

  return {
    getSmartboxPhotos,
    getSearchPhotos
  };
};
