import { inToPx } from './canvas';

/**
 * Get range of portrait for selected page
 *
 * @param   {Number}  currentIndex  index of page in list of selected page
 * @param   {Number}  maxPortrait   max portrait per page
 * @param   {Number}  totalPortrait total portrait
 * @returns {Object}                min index & max index of protrait in folder
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
 * Get range of portrait for selected page
 *
 * @param   {Number}  currentIndex  index of page in list of selected page
 * @param   {Number}  maxPortrait   max portrait per page
 * @param   {Array}   folders       selected portrait folders
 * @returns {Object}                min index & max index of protrait and folder index
 */
const getRangePortraitMultiFolder = (currentIndex, maxPortrait, folders) => {
  // for auto flow
  const portraitInPages = [];

  // TODO: -Luc: Need to improve later for better performance
  folders.forEach((folder, idx) => {
    const pages = Math.ceil(folder.assetsCount / maxPortrait);
    for (let i = 0; i < pages; i++) {
      const { max, min } = getRangePortraitSingleFolder(
        i,
        maxPortrait,
        folder.assetsCount
      );
      portraitInPages.push({ folderIdx: idx, min, max });
    }
  });
  const { max, min, folderIdx } = portraitInPages[currentIndex];

  return { min, max, folderIdx };
};

/**
 * Get portraits for select page (single folder)
 *
 * @param   {Number}  currentIndex  index of page in list of selected page
 * @param   {Number}  maxPortrait   max portrait per page
 * @param   {Array}   folders       selected portrait folders
 * @param   {Number}  totalPortrait total portrait
 * @returns {Array}                 portraits
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

  const assets = folders.reduce((result, item) => {
    return result.concat(item.assets);
  }, []);

  return [...Array(max - min + 1).keys()].map(k => {
    return assets[k + min];
  });
};

/**
 * Get portraits for select page (multi-folder)
 *
 * @param   {Number}  currentIndex  index of page in list of selected page
 * @param   {Number}  maxPortrait   max portrait per page
 * @param   {Array}   folders       selected portrait folders
 * @returns {Array}                 portraits
 */
const getPortraitsMultiFolder = (currentIndex, maxPortrait, folders) => {
  const { min, max, folderIdx } = getRangePortraitMultiFolder(
    currentIndex,
    maxPortrait,
    folders
  );

  return [...Array(max - min + 1).keys()].map(k => {
    return folders[folderIdx].assets[k + min];
  });
};

/**
 * Get portraits for select page
 *
 * @param   {Number}  currentIndex  index of page in list of selected page
 * @param   {Number}  rowCount      total row in config
 * @param   {Number}  colCount      total column in config
 * @param   {Number}  totalPortrait total portrait
 * @param   {Array}   folders       selected portrait folders
 * @returns {Array}                 portraits
 */
export const getPortraitForPage = (
  currentIndex,
  rowCount,
  colCount,
  totalPortrait,
  folders,
  isSingle
) => {
  if (isSingle) {
    return getPortraitsSingleFolder(
      currentIndex,
      rowCount * colCount,
      folders,
      totalPortrait
    );
  }

  return getPortraitsMultiFolder(currentIndex, rowCount * colCount, folders);
};

/**
 *  To convert a value to appropriate ratio that used in preview portrait
 * Inch to px with specific ratio
 * @param {Number} val value will be converted
 * @returns A value will be use in preview portrait
 */
export const getConvertedPreviewValue = val => {
  // 20 is just arbitrary choie, need to discuss to find a right number
  return inToPx(val) / 20;
};

export const getSelectedDataOfFolders = (
  pagesCurrent,
  startOnPageCurrent,
  folders,
  maxPortraitPerPage
) => {
  const selectedData = [];
  folders.forEach((element, index) => {
    const startOnPage = !index
      ? startOnPageCurrent
      : Math.max(selectedData[index - 1].endOnPage + 1, pagesCurrent[index]);
    const pages = getPagesOfFolder(
      element.assetsCount,
      startOnPage,
      maxPortraitPerPage
    );
    selectedData.push({
      startOnPage: pages[0],
      endOnPage: pages[pages.length - 1],
      requiredPages: pages
    });
  });

  return selectedData;
};

export const getPagesOfFolder = (
  totalPortraitsCount,
  startOnPageCurrent,
  maxPortraitPerPage
) => {
  const totalPage = Math.ceil(totalPortraitsCount / maxPortraitPerPage);

  return [...Array(totalPage).keys()].map(p => {
    return p + startOnPageCurrent;
  });
};

export const getSelectedDataOfPages = (pages, startOnPageNumber) => {
  const selectedData = [];

  pages.forEach((element, index) => {
    const page = !index
      ? startOnPageNumber
      : Math.max(selectedData[index - 1] + 1, element);

    selectedData.push(page);
  });

  return selectedData;
};
