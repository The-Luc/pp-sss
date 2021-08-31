/**
 * Get range of portrait for selected page
 *
 * @param {Number}  currentIndex  index of page in list of selected page
 * @param {Number}  maxPortrait   max portrait per page
 */
const getRangePortraitSingleFolder = (
  currentIndex,
  maxPortrait,
  totalPortrait
) => {
  const estimatePortrait = maxPortrait * (currentIndex + 1);

  const min = maxPortrait * currentIndex;
  const max =
    estimatePortrait > totalPortrait ? totalPortrait - 1 : estimatePortrait - 1;

  return { min, max };
};

/**
 * Get portraits for select page (single folder)
 *
 * @param {Number}  currentIndex  index of page in list of selected page
 * @param {Number}  maxPortrait   max portrait per page
 */
const getPortraitsSingleFolder = (
  currentIndex,
  maxPortrait,
  folders,
  totalPortrait
) => {
  const { min, max } = getRangePortraitSingleFolder(
    currentIndex,
    maxPortrait,
    totalPortrait
  );

  return [...Array(max - min + 1).keys()].map(k => {
    return folders[0].assets[k + min];
  });
};

export const getPortraitForPage = (
  currentIndex,
  rowCount,
  colCount,
  totalPortrait,
  folders
) => {
  if (folders.length === 1) {
    return getPortraitsSingleFolder(
      currentIndex,
      rowCount * colCount,
      folders,
      totalPortrait
    );
  }

  return [];
};
