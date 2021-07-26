import { fabric } from 'fabric';
import { cloneDeep, uniqueId } from 'lodash';
import { clearClipboard, isEmpty, getMinPositionObject } from '@/common/utils';
import { OBJECT_TYPE } from '@/common/constants';
import { COPY_OBJECT_KEY } from '@/common/constants/config';
import { computePastedObjectCoord } from './pasteObject';
import { parsePasteObject } from '@/common/utils/string';
/**
 * Handle copy object and save session storage
 *
 * @param   {Object}  event event's clipboard
 * @param   {Array}  currentObjects current objects
 * @param   {Object}  pageSelected page selected
 * @param   {Object}  canvas print canvas or digital canvas
 */
export const copyPpObject = (event, currentObjects, pageSelected, canvas) => {
  let activeObj = canvas.getActiveObject();

  if (!activeObj) return;

  if (event?.clipboardData) {
    clearClipboard(event);
  }

  const activeObjClone = cloneDeep(activeObj);
  let objects = [activeObjClone];

  if (activeObjClone.getObjects) {
    const specialObject = [OBJECT_TYPE.CLIP_ART, OBJECT_TYPE.TEXT].includes(
      activeObjClone.objectType
    );
    objects = specialObject
      ? [activeObjClone]
      : [...activeObjClone.getObjects()];
    activeObjClone.ungroupOnCanvas();
  }

  const jsonData = objects.map(obj => ({
    ...currentObjects[obj.id],
    id: null
  }));

  const cacheData = {
    sheetId: pageSelected.id,
    fabric: activeObjClone,
    [COPY_OBJECT_KEY]: jsonData
  };
  sessionStorage.setItem(COPY_OBJECT_KEY, JSON.stringify(cacheData));
};
/**
 * Function handle active selection of object(s) pasted (single | multiplesingle)
 * @param {Array} listPastedObjects - List object(s) pasted
 * @param {Ref} canvas print canvas or digital canvas
 */
export const setObjectPastetActiveSelection = (listPastedObjects, canvas) => {
  if (listPastedObjects.length === 1) {
    canvas.setActiveObject(listPastedObjects[0]);
  } else if (listPastedObjects.length > 1) {
    const sel = new fabric.ActiveSelection(listPastedObjects, {
      canvas
    });
    canvas.setActiveObject(sel);
  }
};

/**
 * Funtion recursive handle create object(s) and add to store through data be copied and return list object(s) processed
 * @param {Array} objects - List object(s) copied
 * @param {Number} sheetId - Current sheet id
 * @param {Object} fabricObject Fabric's data
 * @param {Number} minLeft Min left position of list objects
 * @param {Number} minTop Min top position of list objects
 * @param {Object} pageSelected page selected
 * @param {Number} countPaste count paste of canvas
 * @param {Function} createElementFromPpData create element from ppData
 * @param {Boolean} isDigital is digital canvas or print canvas
 * @returns {Arrray} List object(s) pasted
 */
export const handlePasteItems = async (
  objects,
  sheetId,
  fabricObject,
  minLeft,
  minTop,
  pageSelected,
  countPaste,
  createElementFromPpData,
  isDigital
) => {
  return Promise.all(
    objects.map(async o => {
      const obj = cloneDeep(o);

      const coord = computePastedObjectCoord(
        obj,
        sheetId,
        fabricObject,
        minLeft,
        minTop,
        pageSelected,
        countPaste,
        isDigital
      );

      const newData = {
        ...obj,
        id: uniqueId(),
        coord
      };
      return createElementFromPpData(newData);
    })
  );
};
/**
 * Function handle to get object(s) be copied from clipboard when user press Ctrl + V (Windows), Command + V (macOS), or from action menu
 * @param {Object}  event event's clipboard
 * @param {Object} pageSelected page selected
 * @param {Number} countPaste count paste of canvas
 * @param {Function} createElementFromPpData create element from ppData
 * @param {Function} setProcessingPaste set processing paste
 * @param {Ref} canvas print canvas or digital canvas
 * @param {Boolean} isDigital is digital canvas or print canvas
 */
export const pastePpObject = async (
  event,
  pageSelected,
  countPaste,
  createElementFromPpData,
  setProcessingPaste,
  canvas,
  isDigital
) => {
  const objectCopy = sessionStorage.getItem(COPY_OBJECT_KEY);
  const objects = parsePasteObject(objectCopy);

  if (isEmpty(objects)) return;

  let dataCopyOutside = (
    event?.clipboardData || window?.clipboardData
  )?.getData('text');

  if (dataCopyOutside) {
    setProcessingPaste();
    return;
  }
  const { sheetId, fabric } = JSON.parse(objectCopy);

  canvas.discardActiveObject();

  const { minLeft, minTop } = getMinPositionObject(fabric);

  const listPastedObjects = await handlePasteItems(
    objects,
    sheetId,
    fabric,
    minLeft,
    minTop,
    pageSelected,
    countPaste,
    createElementFromPpData,
    isDigital
  );

  canvas.add(...listPastedObjects);

  setObjectPastetActiveSelection(listPastedObjects, canvas);
};
