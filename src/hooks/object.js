import { useGetters } from 'vuex-composition-helpers';

import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';

/**
 * The hook to connect to store to getter object's properties
 *  @return {Object} {selectObjectProp: The function to connect to getter, triggerChange: state to trigger change}
 */
export const useObject = () => {
  const {
    onSelectedObject,
    getCurrentObject,
    triggerChange,
    triggerShapeChange,
    triggerClipArtChange
  } = useGetters({
    onSelectedObject: PRINT_GETTERS.SELECT_PROP_CURRENT_OBJECT,
    getCurrentObject: PRINT_GETTERS.CURRENT_OBJECT,
    triggerChange: PRINT_GETTERS.TRIGGER_TEXT_CHANGE,
    triggerShapeChange: PRINT_GETTERS.TRIGGER_SHAPE_CHANGE,
    triggerClipArtChange: PRINT_GETTERS.TRIGGER_CLIPART_CHANGE
  });
  /**
   * The fuction to connect to store to getter object's properties
   * @param {String} prop The property name want to get
   *  @return {String} Property value
   */
  const selectObjectProp = prop => {
    const res = onSelectedObject.value(prop);
    return res;
  };

  return {
    selectObjectProp,
    getCurrentObject,
    triggerChange,
    triggerShapeChange,
    triggerClipArtChange
  };
};
