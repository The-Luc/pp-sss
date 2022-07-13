import { useGetters } from 'vuex-composition-helpers';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import {
  createTemplateMappingApi,
  deleteTemplateMappingApi,
  getMappingConfigApi,
  getSheetMappingConfigApi,
  updateMappingProjectApi,
  updateSheetMappingConfigApi,
  createElementMappingApi,
  getSheetMappingElementsApi,
  deleteElementMappingApi,
  updateElementMappingsApi,
  getBookConnectionsApi,
  createSingleElementMappingApi
} from '@/api/mapping';
import { cloneDeep, get, difference } from 'lodash';
import {
  divideObjectsIntoQuadrants,
  isEmpty,
  isLayoutMappingChecker,
  isPpTextOrImage,
  isPrimaryFormat,
  isSecondaryFormat,
  keepBrokenObjectsOfFrames,
  mappingQuadrantFrames,
  modifyQuadrantObjects,
  updateImageZoomLevel,
  deleteNonMappedObjects,
  calcQuadrantIndexOfFrame,
  modifyDigitalQuadrantObjects,
  copyObjectsFrameObjectsToPrint,
  isAllowSyncData
} from '@/common/utils';
import {
  projectMapping,
  projectMappingToApi,
  sheetMappingConfigMapping,
  sheetMappingConfigToApiMapping
} from '@/common/mapping/mapping';
import {
  useAppCommon,
  useModal,
  useSyncLayoutMapping,
  useFrameAction,
  useSavePageData
} from '@/hooks';
import {
  CONTENT_CHANGE_MODAL,
  CONTENT_VIDEO_CHANGE_MODAL,
  COVER_TYPE,
  PRIMARY_FORMAT_TYPES
} from '@/common/constants';
import { getSheetInfoApi, updateSheetApi } from '@/api/sheet';
import { getItem } from '@/common/storage';

const addingParams = values => {
  const mappingParams = [];

  Object.values(values).forEach(o => {
    const print_element_uid = o[0];
    const digital_element_uid = o[1];

    if (!print_element_uid || !digital_element_uid) return;

    mappingParams.push({ print_element_uid, digital_element_uid });
  });

  return mappingParams;
};

/**
 *  To create params for creating mapping APIs
 *
 * @param {Object} objects
 * @param {Object} cloneTextValues
 * @param {Object} cloneImageValues
 * @param {String} printId  id of print layout
 * @param {String} frameId  id of digital frame
 * @returns
 */
const getParams = (
  objects,
  cloneTextValues,
  cloneImageValues,
  printId,
  frameId
) => {
  objects.forEach(o => {
    if (isUnassigned(o) || o.containerId !== frameId) return; // is unassigned option

    const values = o.isImage ? cloneImageValues : cloneTextValues;

    if (!Array.isArray(values[o.value])) {
      values[o.value] = [];
    }

    values[o.value][1] = o.id;
  });

  const mappingParams = [
    ...addingParams(cloneTextValues),
    ...addingParams(cloneImageValues)
  ];

  return { printId, frameId, mappingParams };
};

const isUnassigned = o => !o.value || o.value === -1;

/* HOOK for MAPPINGS */
export const useMappingTemplate = () => {
  /* DELETE TEMPLATE MAPPINGS */
  const deleteTemplateMapping = config => {
    if (!config?.elementMappings) return;

    const ids = config.elementMappings.map(el => el.id);
    return deleteTemplateMappingApi(ids);
  };

  /* CREATE TEMPLATE MAPPINGS */
  const createTemplateMapping = async (
    printId,
    frameIds,
    overlayData,
    config
  ) => {
    // delete exisitng mappings
    await deleteTemplateMapping(config);

    const textValues = {};
    const imageValues = {};
    const printObjects = [];
    const digitalObjects = [];

    Object.values(overlayData).forEach(o => {
      if (o.isPrint) return printObjects.push(o);

      digitalObjects.push(o);
    });

    // adding print object ids
    printObjects.forEach(o => {
      if (isUnassigned(o)) return; // is unassigned option

      const values = o.isImage ? imageValues : textValues;

      values[o.value] = [];
      values[o.value][0] = o.id;
    });

    // adding digital object ids
    const createMappingPromise = frameIds.map(frameId => {
      const cloneTextValues = cloneDeep(textValues);
      const cloneImageValues = cloneDeep(imageValues);

      const params = getParams(
        digitalObjects,
        cloneTextValues,
        cloneImageValues,
        printId,
        frameId
      );

      if (isEmpty(params.mappingParams)) return [];

      return createTemplateMappingApi(params);
    });

    await Promise.all(createMappingPromise);
  };

  return { createTemplateMapping, deleteTemplateMapping };
};

export const useMappingProject = () => {
  /* GET CONFIG */
  const { generalInfo } = useAppCommon();
  const { breakAllConnections } = useBreakConnections();

  const getMappingConfig = async id => {
    const bookId = id || generalInfo.value.bookId;

    if (!bookId) return {};

    const res = await getMappingConfigApi(bookId);

    let config = get(res, 'data.book.project_mapping_configuration');

    // if config is NULL => need to give it a default value
    if (!config) {
      const defaultConfig = {
        primaryMapping: PRIMARY_FORMAT_TYPES.PRINT.value,
        enableContentMapping: true
      };

      config = await updateMappingProject(bookId, defaultConfig);
    }

    return projectMapping(config);
  };

  /* UPDATE CONFIG */
  const updateMappingProject = async (id, config) => {
    const bookId = id || generalInfo.value.bookId;
    const params = projectMappingToApi(config);

    const res = await updateMappingProjectApi(bookId, params);

    if (config.enableContentMapping === false) {
      // if use set mapping functionality is OFF => set `mapped` field of element mapping to FALSE
      await breakAllConnections(bookId);
    }

    const newConfig = get(res, 'data.update_project_mapping_configuration');

    return projectMapping(newConfig);
  };

  return { getMappingConfig, updateMappingProject };
};

export const useMappingSheet = () => {
  const { getMappingConfig } = useMappingProject();

  const getSheetMappingConfig = async sheetId => {
    const res = await getSheetMappingConfigApi(sheetId);

    const config = get(res, 'data.sheet');
    return sheetMappingConfigMapping(config);
  };

  const updateSheetMappingConfig = async (sheetId, config) => {
    const params = sheetMappingConfigToApiMapping(config);

    return updateSheetMappingConfigApi(sheetId, params);
  };

  const getElementMappings = async sheetId => {
    return getSheetMappingElementsApi(sheetId);
  };

  const createElementMappings = async (
    sheetId,
    mappings,
    printObjectList,
    frames
  ) => {
    const printMappings = {};
    const digitalMappings = {};

    printObjectList.filter(isPpTextOrImage).forEach(o => {
      printMappings[o.idFromLayout] = { print_element_uid: o.id };
    });

    const frameIds = [];
    frames
      .filter(frame => frame.fromLayout)
      .forEach(frame => {
        frameIds.push(frame.id);
        frame.objects.filter(isPpTextOrImage).forEach(o => {
          digitalMappings[o.idFromLayout] = {
            digital_element_uid: o.id,
            digital_frame_id: frame.id
          };
        });
      });

    const apiMappings = {};

    mappings.elementMappings.forEach(({ printElementId, digitalElementId }) => {
      const { print_element_uid } = printMappings[printElementId] || {};
      const { digital_element_uid, digital_frame_id } =
        digitalMappings[digitalElementId] || {};

      if (!print_element_uid || !digital_element_uid) return;

      if (!apiMappings[digital_frame_id]) apiMappings[digital_frame_id] = [];

      // group mapping by digital frame id
      apiMappings[digital_frame_id].push({
        print_element_uid,
        digital_element_uid
      });
    });

    // call API to create element mappings
    await frameIds.reduce(async (acc, frameId) => {
      await acc;

      const config = apiMappings[frameId];

      if (!config) return;

      await createElementMappingApi(sheetId, frameId, config);
    }, Promise.resolve());
  };

  // params: {sheetId, frameId, printId, digitalId}
  const createSingleElementMapping = async (...params) => {
    return createSingleElementMappingApi(...params);
  };

  const deleteElementMappings = async ids => {
    if (isEmpty(ids)) return;

    return deleteElementMappingApi(ids);
  };

  const deleteSheetMappings = async sheetId => {
    // get current element mappings
    const elementMappings = await getElementMappings(sheetId);

    // delete current element mappings
    await deleteElementMappings(elementMappings.map(e => e.id));
  };

  const updateElementMappings = async (
    sheetId,
    mappings,
    printObjects,
    frames
  ) => {
    deleteSheetMappings(sheetId);

    // create new element mappings
    await createElementMappings(sheetId, mappings, printObjects, frames);
  };

  // save sheet element mappings to vuex
  const storeElementMappings = async sheetId => {
    const elementMappings = await getElementMappings(sheetId);
    const elementMappingConfig = cloneDeep(elementMappings);

    const sheetConfig = await getSheetMappingConfig(sheetId);
    const projectConfig = await getMappingConfig();

    const { mappingStatus } = sheetConfig;
    const { enableContentMapping } = projectConfig;

    elementMappingConfig.forEach(el => {
      if (!mappingStatus || !enableContentMapping) {
        el.mapped = false;
      }

      if (!el.digitalElementId || !el.printElementId) {
        el.mapped = false;
      }
    });

    return elementMappingConfig;
  };

  // remove mapping either on print objects or digital objects
  const updateElementMappingByIds = async (ids, isDigital) => {
    const prop = isDigital ? 'digitalElementId' : 'printElementId';

    const promises = ids.map(id =>
      updateElementMappingsApi(id, { [prop]: '' })
    );

    return Promise.all(promises);
  };

  /**
   * Delete element mapping on a page
   * Used when applying portrait on a page
   *
   *  - Get sheet objects and element mappings of sheet
   *  if printElementIds are not in sheet objects ids => the objects has been removed
   *       => remove it from the element mappings by setting PRINT/DIGITAL-elementId = ''
   *
   */
  const removeElementMappingOfPage = async sheetId => {
    const elementMappings = await getElementMappings(sheetId);

    const sheet = await getSheetInfoApi(sheetId);

    const objectIds = sheet.objects.map(o => o.id);

    const mappingIds = elementMappings.reduce((acc, el) => {
      if (!objectIds.includes(el.printElementId)) acc.push(el.id);

      return acc;
    }, []);

    // change printElementId of ids in mappingIds to ''
    await updateElementMappingByIds(mappingIds);
  };

  /**
   * Delete element mapping on frames
   * Used when applying portrait on frames & override mapped layout
   *
   * @param {Array} frameIds ids of frames which portraits are applied on
   *
   */
  const removeElementMapingOfFrames = async (sheetId, frameIds) => {
    const elementMappings = await getElementMappings(sheetId);

    const mappingIds = elementMappings.reduce((acc, el) => {
      if (frameIds.includes(el.digitalContainerId)) acc.push(el.id);
      return acc;
    }, []);

    await updateElementMappingByIds(mappingIds, true);
  };

  return {
    getSheetMappingConfig,
    updateSheetMappingConfig,
    updateElementMappings,
    createSingleElementMapping,
    getElementMappings,
    deleteSheetMappings,
    deleteElementMappings,
    storeElementMappings,
    updateElementMappingByIds,
    removeElementMappingOfPage,
    removeElementMapingOfFrames
  };
};

export const useBreakConnections = () => {
  const breakAllConnections = async bookId => {
    const connectionIds = await getBookConnectionsApi(bookId);

    if (isEmpty(connectionIds)) return;

    await Promise.all(
      connectionIds.map(id => updateElementMappingsApi(id, { mapped: false }))
    );
  };

  const breakSingleConnection = async id => {
    return updateElementMappingsApi(id, { mapped: false });
  };

  return { breakAllConnections, breakSingleConnection };
};

export const useContentChanges = () => {
  const { generalInfo } = useAppCommon();
  const { breakSingleConnection } = useBreakConnections();
  const { toggleModal } = useModal();
  const { getMappingConfig } = useMappingProject();

  const handleTextContentChange = async (
    elementMappings,
    prop,
    elementId,
    isDigital
  ) => {
    if (!Object.prototype.hasOwnProperty.call(prop, 'text')) return;

    const bookId = generalInfo.value.bookId;
    const projectConfig = await getMappingConfig(bookId);
    const attName = isDigital ? 'digitalElementId' : 'printElementId';
    if (!isSecondaryFormat(projectConfig, isDigital)) return;

    // show warning modal
    const eleMappings = cloneDeep(elementMappings);
    const mapping = eleMappings.find(el => el[attName] === elementId);

    // only show modal when user in seconday format and the element is mapped
    if (!mapping || !mapping.mapped) return;

    // call API to break connection
    mapping.mapped = false;
    await breakSingleConnection(mapping.id);

    const isHideMess = getItem(CONTENT_CHANGE_MODAL) || false;

    if (isHideMess)
      return { isDrawObjects: true, elementMappings: eleMappings };

    toggleModal({
      isOpenModal: true
    });

    return {
      isDrawObjects: true,
      elementMappings: eleMappings,
      isShowModal: true
    };
  };

  const handleImageContentChange = async (
    elementMappings,
    elementIds,
    isDigital,
    videoIds
  ) => {
    const bookId = generalInfo.value.bookId;
    const projectConfig = await getMappingConfig(bookId);
    const attName = isDigital ? 'digitalElementId' : 'printElementId';

    /* 
      if DIGITAL is PRIMARY FORMAT:
        check if there are videos, break connnection these videos and
    */
    if (isDigital && isPrimaryFormat(projectConfig, isDigital)) {
      return handleVideoContentChange(elementMappings, videoIds);
    }

    if (!isSecondaryFormat(projectConfig, isDigital)) return;

    // show warning modal
    const eleMappings = cloneDeep(elementMappings);
    const breakingPromises = [];
    const changeMappingIds = [];

    elementIds.forEach(imgElementId => {
      const mapping = eleMappings.find(el => el[attName] === imgElementId);

      // only show modal when user in seconday format and the element is mapped
      if (!mapping || !mapping.mapped) return;

      // call API to break connection
      mapping.mapped = false;
      breakingPromises.push(breakSingleConnection(mapping.id));
      changeMappingIds.push(imgElementId);
    });

    if (isEmpty(breakingPromises)) return;

    await Promise.all(breakingPromises);

    const isHideMess = getItem(CONTENT_CHANGE_MODAL) || false;
    if (isHideMess)
      return {
        isDrawObjects: true,
        elementMappings: eleMappings,
        changeMappingIds
      };

    toggleModal({
      isOpenModal: true
    });
    return {
      isDrawObjects: true,
      elementMappings: eleMappings,
      isShowModal: true,
      changeMappingIds
    };
  };

  // for primary format
  const handleVideoContentChange = async (elementMappings, videoIds) => {
    if (isEmpty(videoIds)) return;

    const eleMappings = cloneDeep(elementMappings);
    const breakingPromises = [];
    const changeMappingIds = [];

    videoIds.forEach(videoId => {
      const mapping = eleMappings.find(el => el.digitalElementId === videoId);

      // only show modal when user in the element is mapped
      if (!mapping || !mapping.mapped) return;

      // call API to break connection
      mapping.mapped = false;
      breakingPromises.push(breakSingleConnection(mapping.id));
      changeMappingIds.push(videoId);
    });

    if (isEmpty(breakingPromises)) return;

    await Promise.all(breakingPromises);

    const isHideMess = getItem(CONTENT_VIDEO_CHANGE_MODAL) || false;
    if (isHideMess)
      return {
        isDrawObjects: true,
        elementMappings: eleMappings,
        changeMappingIds
      };

    toggleModal({
      isOpenModal: true
    });
    return {
      isDrawObjects: true,
      elementMappings: eleMappings,
      isShowVideoModal: true,
      changeMappingIds
    };
  };

  return { handleTextContentChange, handleImageContentChange };
};

export const useQuadrantMapping = () => {
  const { updateFramesAndThumbnails, getSheetFrames } = useFrameAction();
  const { savePageData } = useSavePageData();
  const { getBookInfo } = useGetters({
    getBookInfo: PRINT_GETTERS.GET_BOOK_INFO
  });
  const { deleteElementMappings } = useMappingSheet();

  /**
   * To create element mapping params of custom mapping
   * Element mapping of sheet will content object in `quadrandFrames` which will be synced to digital

   * @param {string} sheetId id of sheet
   * @param {Array<{objects: Array, frameId: string}>} quadrantFrames
   * @param {{ id: string, printElementId: string|null, digitalElementId: string|null, printContainerId: string, digitalContainerId: string, mapped: boolean }[]} elementMappings
   * @return {Promise}
   */
  const madeConnectionOfCustomMapping = (
    sheetId,
    quadrantFrames,
    elementMappings
  ) => {
    const mapIds = elementMappings.map(el => el.printElementId);
    const allFrameObjects = [];

    const apiParams = [];
    quadrantFrames.forEach(qd => {
      const { frameId, objects } = qd;
      const objectIds = objects.map(o => o.id);

      allFrameObjects.push(...objects);

      // if objects are in `elementMappings` => do not need to create new connection
      const newIds = difference(objectIds, mapIds);
      const params = newIds.map(id => ({
        print_element_uid: id,
        digital_element_uid: id
      }));

      if (params.length < 1) return;

      apiParams.push({
        sheetId,
        frameId,
        params
      });
    });

    // delete element mapping of objects have been deleted
    // objects have been deleted are object in `mapIds` but not in `objectIds`
    const removeIds = [];
    const allObjectIds = allFrameObjects.map(o => o.id);
    elementMappings.forEach(el => {
      if (!allObjectIds.includes(el.printElementId)) removeIds.push(el.id);
    });

    console.log(apiParams, removeIds);
    // call api to update to DB
    const createPromise = apiParams.map(pr =>
      createElementMappingApi(pr.sheetId, pr.frameId, pr.params)
    );

    return Promise.all([createPromise, deleteElementMappings(removeIds)]);
  };

  /**
   * To sync data to print in quadrant mapping mode
   * @param {string} sheetId
   * @param {array} pObjects
   * @param {{ id: string, printElementId: string|null, digitalElementId: string|null, printContainerId: string, digitalContainerId: string, mapped: boolean }[]} elementMappings
   */
  const quadrantSyncToDigital = async (sheetId, pObjects, elementMappings) => {
    const objects = cloneDeep(pObjects);

    const [frames, sheet] = await Promise.all([
      getSheetFrames(sheetId),
      getSheetInfoApi(sheetId)
    ]);

    const frameIds = frames
      .filter(f => f.fromLayout)
      .map(f => f.id)
      .sort((a, b) => Number(a) - Number(b));

    const { coverOption } = getBookInfo.value;
    const isHardCover = coverOption === COVER_TYPE.HARDCOVER;

    // remove PRINT objects that are not mapping, meaning not sync these objects
    deleteNonMappedObjects(objects, elementMappings);

    // Divide into 4 quadrants (1 quadrant = 1/2 page);
    // `quadrants`: [q1, q2, q3, q4]
    const quadrants = divideObjectsIntoQuadrants(sheet, objects, isHardCover);

    // modify object's positions and dimensions based on theirs quadrant
    modifyQuadrantObjects(sheet, objects);

    // update image zoom level
    await Promise.all(objects.map(o => updateImageZoomLevel(o)));

    // expected there are enough orginal frames (2-4 frames)
    // mapping frames id and quadrants
    // `quadrantFrames`: [{objects: q1, frameId: 123}]
    const quadrantFrames = mappingQuadrantFrames(quadrants, sheet, frameIds);

    // create mapping connection: element mappings
    const mappingPromise = madeConnectionOfCustomMapping(
      sheetId,
      quadrantFrames,
      elementMappings
    );

    // keep broken DIGITAL objects of digital frames
    keepBrokenObjectsOfFrames(quadrantFrames, frames);

    // // update frames objects, and visited
    const willUpdateFrames = quadrantFrames.map(qd => ({
      id: qd.frameId,
      objects: qd.objects,
      isVisited: true
    }));

    const updateFramePromise = updateFramesAndThumbnails(willUpdateFrames);

    await Promise.all([mappingPromise, updateFramePromise]);
  };

  const quadrantSyncToPrint = async (sheetId, frame, elementMappings) => {
    // if this is supplemental frame => no mapping need
    if (frame.isSupplemental) return;

    const [frames, sheet] = await Promise.all([
      getSheetFrames(sheetId),
      getSheetInfoApi(sheetId)
    ]);

    const { coverOption } = getBookInfo.value;
    const isHardCover = coverOption === COVER_TYPE.HARDCOVER;

    /*
     Get print objects & MUTATE this `printObjects` array to update objects from digital frame
     Then call mutation to generate thumbnail & save data of this array as spread data
    */
    const printObjects = cloneDeep(sheet.objects);
    const fObjects = cloneDeep(frame.objects);

    // remove DIGITAL objects that are not mapping, meaning not sync these objects
    deleteNonMappedObjects(fObjects, elementMappings);

    // get frame quadrant index: handle case COVER and supplemental
    //  quadrantIndex: 0, 1, 2 or 3 these are possible value
    const quadrantIndex = calcQuadrantIndexOfFrame(sheet, frames, frame.id);

    if (quadrantIndex === undefined || quadrantIndex < 0) return; // cannot fint the appropriate quadrant

    // modify object's positions and dimensions based on theirs quadrant
    modifyDigitalQuadrantObjects(sheet, fObjects, quadrantIndex, isHardCover);

    // update image zoom level
    await Promise.all(fObjects.map(o => updateImageZoomLevel(o)));

    // SYNC DATA DIRECTION: printObjects <== fObjects
    copyObjectsFrameObjectsToPrint(printObjects, fObjects);

    const promise = [savePageData(sheetId, printObjects)];
    !sheet.isVisited &&
      promise.push(updateSheetApi(sheetId, { isVisited: true }));

    await Promise.all(promise);
  };

  return { quadrantSyncToDigital, quadrantSyncToPrint };
};

export const useSyncData = () => {
  const { generalInfo } = useAppCommon();
  const { getMappingConfig } = useMappingProject();
  const { getSheetMappingConfig } = useMappingSheet();
  const { syncLayoutToDigital, syncLayoutToPrint } = useSyncLayoutMapping();
  const { quadrantSyncToDigital, quadrantSyncToPrint } = useQuadrantMapping();

  const syncToDigital = async (sheetId, objects, elementMappings) => {
    const bookId = generalInfo.value.bookId;

    // check mapping config
    const config = await getMappingConfig(bookId);
    const sheetConfig = await getSheetMappingConfig(sheetId);

    const isLayoutMapping = isLayoutMappingChecker(sheetConfig);

    if (!isAllowSyncData(config, sheetConfig)) return;

    if (isLayoutMapping) {
      // layout mapping
      return syncLayoutToDigital(sheetId, objects, elementMappings);
    }

    // custom mapping
    return quadrantSyncToDigital(sheetId, objects, elementMappings);
  };

  const syncToPrint = async (sheetId, frame, elementMappings) => {
    if (!frame.fromLayout) return;

    const bookId = generalInfo.value.bookId;

    // check mapping config
    const config = await getMappingConfig(bookId);
    const sheetConfig = await getSheetMappingConfig(sheetId);

    const isLayoutMapping = isLayoutMappingChecker(sheetConfig);

    if (!isAllowSyncData(config, sheetConfig, true)) return;

    if (isLayoutMapping) {
      // layout mapping
      return syncLayoutToPrint(sheetId, frame, elementMappings);
    }

    // custom mapping
    return quadrantSyncToPrint(sheetId, frame, elementMappings);
  };

  return { syncToDigital, syncToPrint };
};
