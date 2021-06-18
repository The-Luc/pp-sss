import { BACKGROUND_PAGE_TYPE } from '@/common/constants';

export const isFullBackground = ({ pageType }) => {
  return pageType === BACKGROUND_PAGE_TYPE.FULL_PAGE.id;
};
