import {
  isEmpty,
  insertItemsToArray,
  insertItemsToObject,
  removeItemsFormArray,
  removeItemsFormObject,
  removeAnimationOrders
} from '../utils';

export const addObject = (state, { id, newObject }) => {
  if (isEmpty(id)) return;

  state.objectIds = insertItemsToArray(state.objectIds, [{ value: id }]);

  state.objects = insertItemsToObject(state.objects, [
    { key: id, value: newObject }
  ]);

  if (isEmpty(state.playInIds)) {
    state.playInIds = [[]];
  }

  if (isEmpty(state.playOutIds)) {
    state.playOutIds = [[]];
  }

  state.playInIds[0].push(id);
  state.playOutIds[0].push(id);
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

  if (isEmpty(state.playInIds)) {
    state.playInIds = [[]];
  }

  if (isEmpty(state.playOutIds)) {
    state.playOutIds = [[]];
  }

  const ids = objects.map(obj => obj.id);

  state.playInIds[0].push(...ids);
  state.playOutIds[0].push(...ids);
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

  if (isEmpty(state.playInIds)) {
    state.playInIds = [[]];
  }

  if (isEmpty(state.playOutIds)) {
    state.playOutIds = [[]];
  }

  state.playInIds = removeAnimationOrders(state.playInIds, ids);
  state.playOutIds = removeAnimationOrders(state.playOutIds, ids);
};
