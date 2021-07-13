import { useGetters } from 'vuex-composition-helpers';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import { GETTERS as DIGITAL_GETTERS } from '@/store/modules/digital/const';

export const useObjectProperties = (isDigital = false) => {
  const GETTERS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;

  const { currentObject, getPropOfCurrentObject } = useGetters({
    currentObject: GETTERS.CURRENT_OBJECT,
    getPropOfCurrentObject: GETTERS.SELECT_PROP_CURRENT_OBJECT
  });

  /**
   * The fuction to connect to store to get object's properties
   * @param {String} prop The property name want to get
   *  @return {String} Property value
   */
  const getProperty = prop => {
    return getPropOfCurrentObject.value(prop);
  };

  return {
    currentObject,
    getProperty
  };
};

/**
 * The hook to connect to store to get Text object's properties
 *  @return {Object} { triggerChange, getProperty }
 */
export const useTextProperties = (isDigital = false) => {
  const GETTERS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;

  const { triggerChange } = useGetters({
    triggerChange: GETTERS.TRIGGER_TEXT_CHANGE
  });

  return {
    ...useObjectProperties(isDigital),
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
