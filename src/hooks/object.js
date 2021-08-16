import { useGetters } from 'vuex-composition-helpers';
import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import { GETTERS as DIGITAL_GETTERS } from '@/store/modules/digital/const';
import { useAppCommon } from './common';

export const useObjectProperties = () => {
  const { value: isDigital } = useAppCommon().isDigitalEdition;

  const GETTERS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;
  const { currentObject, listObjects } = useGetters({
    currentObject: APP_GETTERS.CURRENT_OBJECT,
    listObjects: GETTERS.GET_OBJECTS
  });

  return {
    currentObject,
    listObjects
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

export const useTotalObjects = (isDigital = false) => {
  const GETTETS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;
  const { totalBackground, totalObject } = useGetters({
    totalBackground: GETTETS.TOTAL_BACKGROUND,
    totalObject: GETTETS.TOTAL_OBJECT
  });
  return {
    totalBackground,
    totalObject
  };
};
