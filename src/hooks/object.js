import { useGetters } from 'vuex-composition-helpers';
import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';

export const useObjectProperties = () => {
  const { currentObject } = useGetters({
    currentObject: APP_GETTERS.CURRENT_OBJECT
  });

  return {
    currentObject
  };
};

/**
 * The hook to connect to store to get Text object's properties
 *  @return {Object} { triggerChange, getProperty }
 */
export const useTextProperties = () => {
  const { triggerChange } = useGetters({
    triggerChange: APP_GETTERS.TRIGGER_TEXT_CHANGE
  });

  return {
    ...useObjectProperties(),
    triggerChange
  };
};

export const useElementProperties = () => {
  const { getPropOfCurrentObject } = useGetters({
    getPropOfCurrentObject: APP_GETTERS.SELECT_PROP_CURRENT_OBJECT
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
    triggerChange: APP_GETTERS.TRIGGER_SHAPE_CHANGE
  });

  return {
    ...useElementProperties(),
    triggerChange
  };
};

export const useClipArtProperties = () => {
  const { triggerChange } = useGetters({
    triggerChange: APP_GETTERS.TRIGGER_CLIPART_CHANGE
  });

  return {
    ...useElementProperties(),
    triggerChange
  };
};
