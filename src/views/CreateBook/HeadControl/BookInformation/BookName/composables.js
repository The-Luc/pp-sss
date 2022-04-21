import { updateBookTitle } from '@/api/book';

import { useAppCommon } from '@/hooks';

import { isOk } from '@/common/utils';

export const useBookName = () => {
  const { currentUser, generalInfo, setGeneralInfo } = useAppCommon();

  const updateTitle = async title => {
    const res = await updateBookTitle(generalInfo.value.bookId, title);

    if (!isOk(res)) return;

    setGeneralInfo({ info: { title } });
  };

  return { currentUser, generalInfo, updateTitle };
};
