import { useGetters } from 'vuex-composition-helpers';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import { GETTERS as DIGITAL_GETTERS } from '@/store/modules/digital/const';
import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';

/**
 * The hook to connect to store to getter object's properties
 *  @return {Object} {selectObjectProp: The function to connect to getter, triggerChange: state to trigger change}
 */
export const useTextObject = (isDigital = false) => {
  const GETTERS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;
  const { selectedObject, onSelectedObject, triggerChange } = useGetters({
    selectedObject: GETTERS.CURRENT_OBJECT,
    onSelectedObject: APP_GETTERS.SELECT_PROP_CURRENT_OBJECT,
    triggerChange: APP_GETTERS.TRIGGER_TEXT_CHANGE
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
    selectedObject,
    selectObjectProp,
    triggerChange
  };
};

export const useElementProperties = () => {
  const { getPropOfCurrentObject } = useGetters({
    getPropOfCurrentObject: PRINT_GETTERS.SELECT_PROP_CURRENT_OBJECT
  });
  /**
   * The fuction to connect to store to getter object's properties
   *
   * @param   {String} prop the property name want to get
   * @return  {Any}         property value
   */
  const getProperty = prop => {
    return getPropOfCurrentObject.value(prop);
  };

  return {
    getProperty
  };
};

export const useShapeProperties = () => {
  const { triggerChange } = useGetters({
    triggerChange: PRINT_GETTERS.TRIGGER_SHAPE_CHANGE
  });

  return {
    ...useElementProperties(),
    triggerChange
  };
};

export const useClipArtProperties = () => {
  const { triggerChange } = useGetters({
    triggerChange: PRINT_GETTERS.TRIGGER_CLIPART_CHANGE
  });

  return {
    ...useElementProperties(),
    triggerChange
  };
};

export const useBackgroundProperties = () => {
  const { triggerChange, backgroundsProps } = useGetters({
    triggerChange: PRINT_GETTERS.TRIGGER_BACKGROUND_CHANGE,
    backgroundsProps: PRINT_GETTERS.BACKGROUNDS_PROPERTIES
  });

  return {
    triggerChange,
    backgroundsProps
  };
};
