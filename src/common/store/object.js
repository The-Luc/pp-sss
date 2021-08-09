import {
  isEmpty,
  insertItemsToArray,
  insertItemsToObject,
  removeItemsFormArray,
  removeItemsFormObject
} from '../utils';

export const addObject = (state, { id, newObject }) => {
  if (isEmpty(id)) return;

  state.objectIds = insertItemsToArray(state.objectIds, [{ value: id }]);

  state.objects = insertItemsToObject(state.objects, [
    { key: id, value: newObject }
  ]);
};

export const addObjects = (state, { objects }) => {
  if (isEmpty(objects)) return;

  state.objectIds = insertItemsToArray(
    state.objectIds,
    objects.map(({ id }) => ({ value: id }))
  );

  state.objects = insertItemsToObject(
    state.objects,
    objects.map(({ id, newObject }) => ({ key: id, value: newObject }))
  );
};

export const deleteObjects = (state, { ids }) => {
  state.objectIds = removeItemsFormArray(
    state.objectIds,
    ids.map(id => ({ value: id }))
  );

  state.objects = removeItemsFormObject(
    state.objects,
    ids.map(id => ({ key: id }))
  );
};
