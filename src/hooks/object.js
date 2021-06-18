import { useGetters } from 'vuex-composition-helpers';

import { GETTERS } from '@/store/modules/book/const';

/**
 * The hook to connect to store to getter object's properties
 *  @return {Object} {selectObjectProp: The function to connect to getter, triggerChange: state to trigger change}
 */
export const useObject = () => {
  const {
    selectedId,
    onSelectedObject,
    triggerChange,
    triggerShapeChange
  } = useGetters({
    onSelectedObject: GETTERS.PROP_OBJECT_BY_ID,
    selectedId: GETTERS.SELECTED_OBJECT_ID,
    triggerChange: GETTERS.TRIGGER_TEXT_CHANGE,
    triggerShapeChange: GETTERS.TRIGGER_SHAPE_CHANGE
  });
  /**
   * The fuction to connect to store to getter object's properties
   * @param {String} prop The property name want to get
   *  @return {String} Property value
   */
  const selectObjectProp = prop => {
    const res = onSelectedObject.value({
      id: selectedId.value,
      prop
    });
    return res;
  };

  return {
    selectObjectProp,
    triggerChange,
    triggerShapeChange
  };
};
