import sheetService from '@/api/sheet/api';

export const usePageApi = () => {
  const getPageData = async id => {
    return sheetService.getPageData(id);
  };

  return { getPageData };
};
