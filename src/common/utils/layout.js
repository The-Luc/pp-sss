import { CUSTOM_LAYOUT_TYPE, LAYOUT_PAGE_TYPE } from '../constants';
import { isEmpty } from './util';

/**
 * Get layout option from list layouts option by id
 *
 * @param   {Array} listLayouts - List layouts. It include themeId, layout type
 * @param   {Array} listLayoutType - List layout option of select
 * @param   {Number} layoutId - Layout id of sheet
 * @returns {Object} Object layout option
 */
export const getLayoutOptSelectedById = (
  listLayouts,
  listLayoutType,
  layoutId
) => {
  const layout = listLayouts.find(layout => layout.id === layoutId);

  const layoutType = listLayoutType.find(({ value }) => value === layout.type);

  if (!isEmpty(layoutType)) return layoutType;

  const layoutOpt = listLayoutType.find(
    layout => layout.value === CUSTOM_LAYOUT_TYPE
  );

  const indexSubItem =
    layout.pageType === LAYOUT_PAGE_TYPE.SINGLE_PAGE.id ? 0 : 1;

  return {
    value: layoutOpt.value,
    sub: layoutOpt.subItems[indexSubItem]
  };
};
