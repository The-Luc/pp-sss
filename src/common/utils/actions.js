import { cloneDeep } from 'lodash';
import { clearClipboard } from '@/common/utils';
import { OBJECT_TYPE } from '@/common/constants';
import { COPY_OBJECT_KEY } from '@/common/constants/config';
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
    objects = specialObject ? [activeObjClone] : [...activeObjClone._objects];
    activeObjClone.restoreObjectsState();
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
