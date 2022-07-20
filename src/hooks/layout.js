import { useMutations, useGetters } from 'vuex-composition-helpers';

import { cloneDeep, findKey, uniqBy } from 'lodash';
import {
  saveToFavoritesApi,
  deleteFavoritesApi,
  getFavoritesApi,
  getFavoriteLayoutsApi
} from '@/api/user';
import {
  getLayoutElementsApi,
  saveCustomPrintLayoutApi,
  getCustomPrintLayoutApi,
  getCustomDigitalLayoutApi,
  saveCustomDigitalLayoutApi,
  getDigitalLayoutsApi,
  getLayoutsByThemeAndTypeApi,
  getDigitalLayoutElementApi,
  getAssortedLayoutsApi,
  getPrintLayoutsByTypeApi,
  getDigitalLayoutsByTypeApi,
  getPrintLayoutById
} from '@/api/layout';

import { GETTERS as THEME_GETTERS } from '@/store/modules/theme/const';

import {
  MUTATES as APP_MUTATES,
  GETTERS as APP_GETTERS
} from '@/store/modules/app/const';
import {
  GETTERS as PRINT_GETTERS,
  MUTATES as PRINT_MUTATES
} from '@/store/modules/print/const';
import {
  GETTERS as DIGITAL_GETTERS,
  MUTATES as DIGITAL_MUTATES
} from '@/store/modules/digital/const';

import {
  TOOL_NAME,
  EDITION,
  MODAL_TYPES,
  COVER_TYPE,
  TRANS_TARGET,
  SHEET_TYPE,
  LAYOUT_PAGE_TYPE,
  OBJECT_TYPE,
  DIGITAL_LAYOUT_TYPES,
  SAVED_AND_FAVORITES_TYPE,
  PRINT_PAGE_SIZE,
  MAPPING_TYPES
} from '@/common/constants';

import {
  generateCanvasThumbnail,
  getPageLayouts,
  isCoverSheetChecker,
  isHalfSheet,
  isHalfRight,
  isOk,
  isEmpty,
  entitiesToObjects,
  getCoverPagePrintSize,
  isFullBackground,
  isBackground,
  activeCanvasInfo,
  isPpTextObject,
  isPpImageObject,
  getUniqueId,
  removeMediaContentWhenCreateThumbnail,
  isSingleLayout,
  getObjectById,
  getDigitalObjectById,
  isContentDifference,
  updateContentToObject
} from '@/common/utils';
import { useThumbnail } from '@/views/CreateBook/composables';
import {
  getFrameObjectsApi,
  deleteFrameApi,
  getFramesAndTransitionsApi
} from '@/api/frame';
import {
  useFrame,
  useFrameOrdering,
  useFrameAction,
  useSavePageData,
  useMappingSheet
} from '@/hooks';
import { updateTransitionApi } from '@/api/playback';
import {
  changeObjectsCoords,
  isCoverLayoutChecker
} from '@/common/utils/layout';
import { useMappingProject } from './mapping';
import {
  getSheetInfoApi,
  getSheetPreviewInfoApi,
  updateSheetApi
} from '@/api/sheet';

export const useLayoutPrompt = edition => {
  const EDITION_GETTERS =
    edition === EDITION.PRINT ? PRINT_GETTERS : DIGITAL_GETTERS;
  const EDITION_MUTATES =
    edition === EDITION.PRINT ? PRINT_MUTATES : DIGITAL_MUTATES;

  const { isPrompt, pageSelected, themeId } = useGetters({
    isPrompt: APP_GETTERS.IS_PROMPT,
    pageSelected: EDITION_GETTERS.CURRENT_SHEET,
    themeId: EDITION_GETTERS.DEFAULT_THEME_ID
  });

  const { setIsPrompt, setToolNameSelected, updateVisited } = useMutations({
    updateVisited: EDITION_MUTATES.UPDATE_SHEET_VISITED,
    setIsPrompt: APP_MUTATES.SET_IS_PROMPT,
    setToolNameSelected: APP_MUTATES.SET_TOOL_NAME_SELECTED
  });

  const openPrompt = promptEdtion => {
    setIsPrompt({ isPrompt: true });

    const toolName =
      promptEdtion === EDITION.PRINT
        ? TOOL_NAME.PRINT_LAYOUTS
        : TOOL_NAME.DIGITAL_LAYOUTS;

    setToolNameSelected({ name: toolName });
  };

  return {
    updateVisited,
    isPrompt,
    setIsPrompt,
    pageSelected,
    openPrompt,
    themeId
  };
};

/**
 * to get layout elements
 * @returns layout elements
 */
export const useLayoutElements = () => ({
  getLayoutElements: getLayoutElementsApi
});

/**
 * to return the getters digital layout
 * @returns getters
 */
export const useGetDigitalLayouts = () => {
  const { sheetLayout, listLayouts } = useGetters({
    sheetLayout: DIGITAL_GETTERS.SHEET_LAYOUT,
    listLayouts: THEME_GETTERS.GET_DIGITAL_LAYOUTS_BY_THEME_ID
  });

  const getDigitalLayouts = async (themeId, layoutTypeId, isIgnoreCache) => {
    const layouts = await getDigitalLayoutsApi(themeId, isIgnoreCache);

    const isSupplemental =
      layoutTypeId === DIGITAL_LAYOUT_TYPES.SUPPLEMENTAL_LAYOUTS.value;

    const layoutUse = findKey(
      DIGITAL_LAYOUT_TYPES,
      o => o.value === layoutTypeId
    );

    // get layouts at the theme preview screen
    if (!layoutTypeId) return layouts;

    if (isSupplemental) return layouts.filter(l => l.isSupplemental);

    return layouts.filter(l => l.layoutUse === layoutUse && !l.isSupplemental);
  };

  const getDigitalLayoutElements = getDigitalLayoutElementApi;

  return {
    sheetLayout,
    listLayouts,
    getDigitalLayouts,
    getDigitalLayoutElements
  };
};

export const useActionLayout = () => {
  const saveToFavorites = async id => {
    const res = await saveToFavoritesApi(id);

    return isOk(res);
  };

  const deleteFavorites = async id => {
    const res = await deleteFavoritesApi(id);

    return isOk(res);
  };

  return {
    saveToFavorites,
    deleteFavorites,
    getFavorites: getFavoritesApi,
    getFavoriteLayouts: getFavoriteLayoutsApi
  };
};

export const useCustomLayout = () => {
  const { toggleModal } = useMutations({
    toggleModal: APP_MUTATES.TOGGLE_MODAL
  });

  const { getBookInfo: bookInfo } = useGetters({
    getBookInfo: PRINT_GETTERS.GET_BOOK_INFO
  });

  const { uploadBase64Image } = useThumbnail();

  /**
   *  Used to generate thumbnails when saving user custom templates
   */
  const getLayoutThumbnail = async (objects, options, isDigital) => {
    // remove image url of image object and convert video to image
    const modifyObjects = removeMediaContentWhenCreateThumbnail(objects);

    return generateCanvasThumbnail(modifyObjects, isDigital, options);
  };

  const saveCustomPrintLayout = async (setting, data) => {
    const { id, type, layoutName } = setting;

    const isSpread = type === 'SHEET';

    let objects = cloneDeep(data.objects);

    if (!(isSpread || isHalfSheet(data.sheetProps))) {
      const { leftLayout, rightLayout } = getPageLayouts(data);
      const pageIds = data.sheetProps.pageIds;

      objects = id === pageIds[0] ? leftLayout.elements : rightLayout.elements;
    }

    if (isHalfRight(data.sheetProps)) {
      objects = changeObjectsCoords(objects, 'right', { moveToLeft: true });
    }

    const isCover = isCoverSheetChecker(data.sheetProps);
    const isHardCover =
      COVER_TYPE.HARDCOVER === bookInfo.value.coverOption && isCover;

    const options = {
      isSpread,
      isCover,
      isHardCover
    };

    const imageBase64 = await getLayoutThumbnail(objects, options);

    const previewImageUrl = await uploadBase64Image(imageBase64);

    const isSuccess = await saveCustomPrintLayoutApi(
      id,
      type,
      layoutName,
      previewImageUrl,
      isCover
    );

    if (!isSuccess) return;

    toggleModal({
      isOpenModal: true,
      modalData: {
        type: MODAL_TYPES.SAVE_LAYOUT_SUCCESS
      }
    });
  };

  const getCustomPrintLayout = async isIgnoreCache => {
    const layouts = await getCustomPrintLayoutApi(isIgnoreCache);
    return layouts.map(layout => ({
      ...layout,
      isCustom: true
    }));
  };
  /**
   * Return package and supplemental layouts that user saved
   */
  const getCustomDigitalLayout = async isIgnoreCache => {
    return getCustomDigitalLayoutApi(isIgnoreCache);
  };

  const saveCustomDigitalLayout = async setting => {
    const { ids, isSupplemental, layoutName } = setting;

    // get frame data
    const framesObjects = await Promise.all(
      ids.map(id => getFrameObjectsApi(id))
    );

    // generate thumbnails
    const imageBase64 = await Promise.all(
      framesObjects.map(objects => getLayoutThumbnail(objects, {}, true))
    );

    const previewImageUrls = await Promise.all(
      imageBase64.map(img => uploadBase64Image(img))
    );

    const frameSelections = ids.map((id, index) => ({
      id: +id,
      preview_image_url: previewImageUrls[index]
    }));

    // currently save only the thumbanail of the first frame
    // to make the layout thumbnail
    const isSuccess = await saveCustomDigitalLayoutApi({
      frameSelections,
      isSupplemental,
      title: layoutName,
      previewUrl: previewImageUrls[0]
    });

    // if successed, show the success modal
    if (!isSuccess) return;

    toggleModal({
      isOpenModal: true,
      modalData: {
        type: MODAL_TYPES.SAVE_LAYOUT_SUCCESS
      }
    });
  };

  return {
    saveCustomPrintLayout,
    getCustom: getCustomPrintLayout,
    getCustomDigitalLayout,
    saveCustomDigitalLayout
  };
};

export const useGetLayouts = () => {
  const { getFavoriteLayouts } = useActionLayout();
  const { getCustom, getCustomDigitalLayout } = useCustomLayout();
  const { getDigitalLayouts: fetchDigitalLayouts } = useGetDigitalLayouts();

  const getPrintLayouts = async (theme, layoutType, isIgnoreCache) => {
    if (isEmpty(theme) || isEmpty(layoutType)) {
      return [];
    }

    const isSelectFavorite = layoutType === SAVED_AND_FAVORITES_TYPE.value;

    if (!isSelectFavorite) {
      return getLayoutsByThemeAndTypeApi(theme, layoutType, isIgnoreCache);
    }

    const layouts = await Promise.all([
      getFavoriteLayouts(isIgnoreCache),
      getCustom(isIgnoreCache)
    ]);

    return layouts.flat();
  };

  const getPrintLayoutByType = async (
    currentThemeId,
    layoutTypeId,
    isIgnoreCache
  ) => {
    if (!layoutTypeId) return [];

    const templates = await getPrintLayoutsByTypeApi(
      layoutTypeId,
      isIgnoreCache
    );
    const newTemplates = templates.filter(t => t.themeId !== currentThemeId);

    return uniqBy(newTemplates, 'id');
  };

  const getDigitalLayoutByType = async (
    currentThemeId,
    layoutTypeId,
    isIgnoreCache
  ) => {
    if (!layoutTypeId) return [];

    const templates = await getDigitalLayoutsByTypeApi(
      layoutTypeId,
      isIgnoreCache
    );
    const newTemplates = templates.filter(
      t => t.themeId !== currentThemeId && !t.isSupplemental
    );

    return uniqBy(newTemplates, 'id');
  };

  const getDigitalLayouts = async (
    theme,
    layoutType,
    isSupplemental,
    isIgnoreCache
  ) => {
    if (isEmpty(theme) || isEmpty(layoutType)) {
      return [];
    }

    const isSelectFavorite = layoutType === SAVED_AND_FAVORITES_TYPE.value;
    if (!isSelectFavorite) {
      return fetchDigitalLayouts(theme, layoutType, isIgnoreCache);
    }

    const customLayouts = await getCustomDigitalLayout(isIgnoreCache);

    const customPackage = customLayouts.filter(
      layout => !layout.isSupplemental
    );
    const customSupplemental = customLayouts.filter(
      layout => layout.isSupplemental
    );
    return isSupplemental ? customSupplemental : customPackage;
  };

  return {
    getPrintLayouts,
    getDigitalLayouts,
    getAssortedLayouts: getAssortedLayoutsApi,
    getPrintLayoutByType,
    getDigitalLayoutByType
  };
};

export const useLayoutAddingSupport = () => {
  const { updateFrameOrder } = useFrameOrdering();
  const { createFramesFromLayout, getSheetFrames } = useFrameAction();
  const { getDigitalLayoutElements } = useGetDigitalLayouts();

  const { currentSheet, getObjects, getBookInfo } = useGetters({
    currentSheet: PRINT_GETTERS.CURRENT_SHEET,
    getObjects: PRINT_GETTERS.GET_OBJECTS,
    getBookInfo: PRINT_GETTERS.GET_BOOK_INFO
  });

  const { clearBackgrounds, setBackground } = useMutations({
    clearBackgrounds: PRINT_MUTATES.CLEAR_BACKGROUNDS,
    setBackground: PRINT_MUTATES.SET_BACKGROUND
  });

  /* DIGITAL LAYOUT - START */
  /**
   * To get digital layout, make it ready to apply to canvas.
   * - CAll api to get layout data
   * - Clone layout
   * - generate object id
   *
   * @param {String} layoutId layout id
   * @returns modified layout data
   */
  const getLayoutFrames = async layoutId => {
    const layoutEl = await getDigitalLayoutElements(layoutId);

    const layout = cloneDeep(layoutEl);

    layout.frames.map(f => (f.objects = entitiesToObjects(f.objects)));

    // generate unique id for objects
    layout.frames.forEach(frame => {
      // copy id to idFromLayout field for text and iamge objects, which is used for layout mapping
      frame.objects = frame.objects.map(o => {
        if (isPpTextObject(o) || isPpImageObject(o)) o.idFromLayout = o.id;

        return { ...o, id: getUniqueId() };
      });
    });
    return layout;
  };

  const addingLayoutFrames = async (sheetId, layoutId) => {
    const layout = await getLayoutFrames(layoutId);

    const transitions = layout.frames
      .map(({ transition }) => (transition ? transition : null))
      .filter(Boolean);

    const frames = await getSheetFrames(sheetId);

    const finalFrames = frames.filter(frame => !frame.fromLayout);

    const primaryFrameIds = frames
      .filter(frame => frame.fromLayout)
      .map(f => f.id);

    // remove all primary frames
    await Promise.all(primaryFrameIds.map(id => deleteFrameApi(id)));

    // add new frames
    const newFrames = await createFramesFromLayout(sheetId, layout);

    // reorder frames
    finalFrames.unshift(...newFrames);
    const frameIds = finalFrames.map(f => parseInt(f.id));
    await updateFrameOrder(sheetId, frameIds);

    // if length of layoutFrames > 1, means that it's package layout and there are transition
    // update transitions
    if (layout.frames.length > 1) {
      const { transitions: dbTransitions } = await getFramesAndTransitionsApi(
        sheetId
      );

      const transitionId = dbTransitions.map(t => t.id);

      if (isEmpty(transitionId)) return;

      await Promise.all(
        transitions.map((trans, idx) =>
          updateTransitionApi(transitionId[idx]?.id, trans, TRANS_TARGET.SELF)
        )
      );
    }
    return finalFrames;
  };
  /* DIGITAL LAYOUT - END */

  /* PRINT LAYOUT - START */
  const handleAddingBackgrounds = (
    objects,
    isFullLayout,
    currentPosition,
    isLeftPage
  ) => {
    let backgrounds = [];

    // Get background object
    const backgroundObjs = objects.filter(
      obj => obj.type === OBJECT_TYPE.BACKGROUND
    );

    if (backgroundObjs.length === 0) {
      const selectedPosition = isFullLayout ? '' : currentPosition;

      clearBackgrounds(selectedPosition);
    }

    if (backgroundObjs.length === 2) {
      backgroundObjs.forEach(bg => {
        const background = { ...bg, id: getUniqueId() };
        backgrounds.push(background);
        setBackground({ background });
      });
    }

    if (backgroundObjs.length === 1) {
      isFullLayout && clearBackgrounds();

      const isLeftBackground = isLeftPage || backgroundObjs[0].isLeftPage;

      backgroundObjs[0].isLeftPage = isLeftBackground;

      const background = { ...backgroundObjs[0], id: getUniqueId() };
      backgrounds.push(background);
      setBackground({ background });
    }

    return backgrounds;
  };

  /**
   * To fit objects in cover sheet
   * The function only called when applying layout on cover
   *
   * @param {Object} objects objects of layout
   * @param {Boolean} isRightPage wheter applying single layout on right page
   * @returns
   */
  const handleFitElements = (objects, isRightPage) => {
    const { coverOption, numberMaxPages } = getBookInfo.value;
    const isHardCoverBook = coverOption === COVER_TYPE.HARDCOVER;

    // find the inner top lef of the left canvas
    const canvasSize = getCoverPagePrintSize(isHardCoverBook, numberMaxPages);
    const {
      sheetWidth,
      spineWidth,
      pageWidth,
      pageHeight,
      bleedTop
    } = canvasSize.inches;

    // find the inner top left of the left canvas
    const leftX = (sheetWidth - spineWidth) / 2 - pageWidth;
    const leftY = bleedTop;

    // find the inner top left of the right canvas
    const rightX = (sheetWidth + spineWidth) / 2;
    // y = bleedTop
    const rightY = bleedTop;

    /* To get mid of the current sheet, could be HARDCOVER or SOFTCOVER */
    const { mid: coverMidCanvas } = activeCanvasInfo();

    // mid of normal canvas
    const mid = PRINT_PAGE_SIZE.PDF_WIDTH - PRINT_PAGE_SIZE.BLEED;

    // when applying single layout on right page, need to take out coverMidCanvas from x coordinate
    // because already called changeCoordObjecs previously to add this coverMid
    const offset = isRightPage ? coverMidCanvas : mid;

    objects.forEach(o => {
      if (isBackground(o)) return;

      if (o.coord.x < mid) {
        // left page objects
        o.coord.x += leftX;
        o.coord.y += leftY;
      } else {
        // right page objects
        o.coord.x += rightX - offset;
        o.coord.y += rightY;
      }
    });

    // -- BACKGROUNDS --
    // Get background objects
    const backgrounds = objects.filter(isBackground);
    // case 1: no backgrounds
    if (backgrounds.lenght === 0) return;

    /*
    modify background object
    case 1: full-background
    case 2: 2 page background
    case 3: 1 page background (left or right)
    */
    backgrounds.forEach(bg => {
      bg.size.height = pageHeight;
      bg.size.width = pageWidth - PRINT_PAGE_SIZE.BLEED;

      if (bg.isLeftPage) {
        bg.coord.x = leftX;
        bg.coord.y = leftY;
      } else {
        bg.coord.x = rightX;
        bg.coord.y = rightY;
      }

      if (isFullBackground(bg)) {
        bg.size.width = pageWidth * 2;
      }
    });
  };

  /**
   * To scale objects in cover sheet
   * The function only called when applying layout on cover
   *
   * @param {Object} objects objects of layout
   * @returns
   */
  const handleScaleElements = (objects, isRightPage) => {
    /* To get mid of the current sheet, could be HARDCOVER or SOFTCOVER */
    const { width, height, mid: coverMidCanvas } = activeCanvasInfo();
    const scaleX = width / PRINT_PAGE_SIZE.PDF_DOUBLE_WIDTH;
    const scaleY = height / PRINT_PAGE_SIZE.PDF_HEIGHT;

    // mid of normal canvas
    const mid = PRINT_PAGE_SIZE.PDF_WIDTH - PRINT_PAGE_SIZE.BLEED;

    // when applying single layout on right page, need to take out coverMidCanvas from x coordinate
    // because already called changeCoordObjecs previously to add this coverMid
    objects.forEach(o => {
      if (isBackground(o)) return;

      if (isRightPage) {
        o.coord.x += -coverMidCanvas + mid;
      }
      o.coord.x *= scaleX;
      o.coord.y *= scaleY;

      o.size.width *= scaleX;
      o.size.height *= scaleY;
    });
  };

  const addingLayoutOnPages = (layout, pagePosition, isScale, isFit) => {
    const sheet = currentSheet.value;
    const sheetType = sheet.type;
    const isCoverSheet = isCoverSheetChecker(sheet);
    const isCoverLayout = isCoverLayoutChecker(layout);

    const objects = entitiesToObjects(layout.objects);

    // Check whether user has add single page or not.
    //Value: left or right with single page else undefine
    const isFullLayout = layout.pageType === LAYOUT_PAGE_TYPE.FULL_PAGE.id;

    // Front cover always has the right page
    // Back cover always has the left page
    const currentPosition = (() => {
      if (sheetType === SHEET_TYPE.FRONT_COVER) return 'right';

      return currentSheet.type === SHEET_TYPE.BACK_COVER
        ? 'left'
        : pagePosition;
    })();

    const isLeftPage = currentPosition === 'left'; // true if half-layout applied on left page
    const isRightPage = currentPosition === 'right'; // true if half-layout applied on right page

    const backgrounds = handleAddingBackgrounds(
      objects,
      isFullLayout,
      currentPosition,
      isLeftPage
    );

    if (!isCoverLayout && isCoverSheet) {
      isFit && handleFitElements(objects, isRightPage);
      isScale && handleScaleElements(objects, isRightPage);
    }

    // Get object(s) rest
    const restObjs = objects.filter(obj => obj.type !== OBJECT_TYPE.BACKGROUND);

    if (isFullLayout || isHalfSheet(currentSheet.value)) {
      const newObj = restObjs.map(obj => ({
        ...obj,
        idFromLayout: obj.id,
        id: getUniqueId()
      }));
      return { objects: newObj, backgrounds };
    }

    const newObjects = restObjs.map(obj => ({
      ...obj,
      position: currentPosition,
      idFromLayout: obj.id,
      id: getUniqueId()
    }));

    const { mid } = activeCanvasInfo();

    const storeObjects = Object.values(cloneDeep(getObjects.value)).filter(
      obj => {
        if (isEmpty(obj)) return false;

        const x = obj.coord.x;

        const isKeepLeft = isRightPage && x < mid;
        const isKeepRight = isLeftPage && x >= mid;

        return isKeepLeft || isKeepRight;
      }
    );

    return { objects: [...storeObjects, ...newObjects], backgrounds };
  };

  /* PRINT LAYOUT - END */

  return { getLayoutFrames, addingLayoutFrames, addingLayoutOnPages };
};

export const useApplyPrintLayout = () => {
  const { setObjects, setSheetData } = useMutations({
    setObjects: PRINT_MUTATES.SET_OBJECTS,
    setSheetData: PRINT_MUTATES.SET_SHEET_DATA
  });

  const { applyMappedDigitalLayout } = useMappingLayout();
  const { addingLayoutOnPages } = useLayoutAddingSupport();

  const applyPrintLayout = async ({
    themeId,
    layout,
    pagePosition,
    isScale,
    isFit
  }) => {
    const { objects: objectList } = addingLayoutOnPages(
      layout,
      pagePosition,
      isScale,
      isFit
    );

    // UPDATE for Mapped Layout
    await applyMappedDigitalLayout(layout, objectList);

    setObjects({ objectList });

    // Update sheet fields
    setSheetData({
      layoutId: layout.id,
      themeId,
      previewImageUrl: layout.previewImageUrl
    });
  };

  return { applyPrintLayout };
};

export const useApplyDigitalLayout = () => {
  const { currentSheet } = useGetters({
    currentSheet: DIGITAL_GETTERS.CURRENT_SHEET
  });

  const { setSheetData } = useMutations({
    setSheetData: DIGITAL_MUTATES.SET_SHEET_DATA
  });

  const { setFrames, setCurrentFrameId, clearAllFrames } = useFrame();
  const { applyMappedPrintLayout } = useMappingLayout(true);
  const { addingLayoutFrames } = useLayoutAddingSupport();

  const applyDigitalLayout = async layout => {
    const { id: sheetId } = currentSheet.value;

    const finalFrames = await addingLayoutFrames(sheetId, layout.id);

    // UPDATE for Mapped Layout
    await applyMappedPrintLayout(layout, finalFrames);

    clearAllFrames();
    setFrames({ framesList: finalFrames });

    setCurrentFrameId({ id: finalFrames[0].id });

    // Update sheet fields
    setSheetData({
      layoutId: layout.id
    });

    return finalFrames;
  };

  return { applyDigitalLayout, addingLayoutFrames };
};

export const useMappingLayout = isDigital => {
  const GETTERS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;

  const { getMappingConfig } = useMappingProject();
  const { currentSheet } = useGetters({
    currentSheet: GETTERS.CURRENT_SHEET
  });
  const { updateSheetMappingConfig, updateElementMappings } = useMappingSheet();
  const { addingLayoutFrames, addingLayoutOnPages } = useLayoutAddingSupport();
  const { savePageData } = useSavePageData();

  /**
   * Call API to update a sheet mapping_type to LAYOUT_MAPPING
   * Call API to update a sheet is_visited to TRUE
   */
  const updateSheet = async sheetId => {
    const mappingType = MAPPING_TYPES.LAYOUT.value;
    await Promise.all([
      updateSheetMappingConfig(sheetId, { mappingType }),
      updateSheetApi(sheetId, { isVisited: true })
    ]);
  };

  // trigger when use apply a mapped layout on print editor
  // so then this will apply the digital layout
  const applyMappedDigitalLayout = async (printLayout, printObjectList) => {
    const mappingConfig = await getMappingConfig();

    if (!printLayout.mappings || !mappingConfig.enableContentMapping) return;

    const layoutId = printLayout.mappings.theOtherLayoutId;
    const { id: sheetId } = currentSheet.value;

    // apply digital layout on digital
    const frames = await addingLayoutFrames(sheetId, layoutId);

    // create element mapping
    await updateElementMappings(
      sheetId,
      printLayout.mappings,
      printObjectList,
      frames
    );

    // call api update mapping type to LAYOUT MAPPING, and isVisited: true
    await updateSheet(sheetId);

    // call api to get sheet data - update local cache
    await getSheetPreviewInfoApi(sheetId);
  };

  // trigger when use apply a mapped layout on digital editor
  // so then this will apply the print layout
  const applyMappedPrintLayout = async (digitalLayout, frames) => {
    const mappingConfig = await getMappingConfig();

    if (!digitalLayout.mappings || !mappingConfig.enableContentMapping) return;

    const layoutId = digitalLayout.mappings.theOtherLayoutId;
    const { id: sheetId } = currentSheet.value;

    const printLayout = await getPrintLayoutById(layoutId);

    // apply print layout on digital
    const { objects, backgrounds } = addingLayoutOnPages(
      printLayout,
      'left',
      true,
      false
    );

    const allObjects = [...backgrounds, ...objects];

    const isForceToRight =
      isHalfRight(currentSheet.value) && isSingleLayout(printLayout);

    // mid of normal canvas
    const option = { isForceToRight };

    await savePageData(sheetId, allObjects, null, option);

    // create element mapping
    await updateElementMappings(
      sheetId,
      digitalLayout.mappings,
      allObjects,
      frames
    );

    // call api update mapping type to LAYOUT MAPPING, and isVisited: true
    await updateSheet(sheetId);
  };

  return { applyMappedDigitalLayout, applyMappedPrintLayout };
};

export const useSyncLayoutMapping = () => {
  const { getSheetFrames, updateFramesAndThumbnails } = useFrameAction();
  const { savePageData } = useSavePageData();

  const syncLayoutToDigital = async (sheetId, printObjects, elementMapping) => {
    // mapping function: update data for digital frames
    // load all digital frames of current sheet
    const dbFrames = await getSheetFrames(sheetId);
    const frames = cloneDeep(dbFrames);

    const willUpdateFrameIds = [];

    const printObjectByIds = getObjectById(printObjects);
    const digitalObjectByIds = getDigitalObjectById(frames);

    await elementMapping.reduce(async (acc, mapping) => {
      // await for the previous item to finish processing
      await acc;

      if (!mapping.mapped) return;

      // update content if mapped
      // compare content of print object and digital object
      const {
        digitalContainerId: frameId,
        printElementId,
        digitalElementId
      } = mapping;

      const printObject = printObjectByIds[printElementId];
      const digitalObject = digitalObjectByIds[digitalElementId];

      if (!printObject || !digitalObject) return;

      if (!isContentDifference(printObject, digitalObject)) return;

      await updateContentToObject(printObject, digitalObject);

      willUpdateFrameIds.push(frameId);
    }, Promise.resolve());

    // call API to save to DB
    const frameIds = [...new Set(willUpdateFrameIds)];
    const willUpdateFrames = frames.filter(frame =>
      frameIds.includes(frame.id)
    );

    await updateFramesAndThumbnails(willUpdateFrames);
  };

  const syncLayoutToPrint = async (sheetId, frame, elementMapping) => {
    // mapping function: update data for print spread
    // load print spread data
    const sheet = await getSheetInfoApi(sheetId);
    const { objects: dbObjects } = sheet;
    const printObjects = cloneDeep(dbObjects);

    const printObjectByIds = getObjectById(printObjects);
    const digitalObjectByIds = getObjectById(frame.objects);
    let isNeedToUpdate = false;

    await elementMapping.reduce(async (acc, mapping) => {
      // await for the previous item to finish processing
      await acc;

      if (!mapping.mapped) return;

      // update content if mapped
      // compare content of print object and digital object
      const { printElementId, digitalElementId } = mapping;

      const printObject = printObjectByIds[printElementId];
      const digitalObject = digitalObjectByIds[digitalElementId];

      if (!printObject || !digitalObject) return;

      if (!isContentDifference(digitalObject, printObject)) return;

      await updateContentToObject(digitalObject, printObject);

      isNeedToUpdate = true;
    }, Promise.resolve());

    // call API to save to DB
    if (!isNeedToUpdate) return;

    await savePageData(sheetId, printObjects);
  };
  return { syncLayoutToDigital, syncLayoutToPrint };
};
