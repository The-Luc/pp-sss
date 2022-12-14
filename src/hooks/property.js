import { useGetters, useMutations } from 'vuex-composition-helpers';
import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';
import { MUTATES as PRINT_MUTATES } from '@/store/modules/print/const';
import { MUTATES as DIGITAL_MUTATES } from '@/store/modules/digital/const';
import { useAppCommon } from './common';

export const useMenuProperties = () => {
  const { isOpenMenuProperties } = useGetters({
    isOpenMenuProperties: APP_GETTERS.IS_OPEN_MENU_PROPERTIES
  });

  return {
    isOpenMenuProperties
  };
};

export const useProperties = () => {
  const { value: isDigital } = useAppCommon().isDigitalEdition;

  const MUTATES = isDigital ? DIGITAL_MUTATES : PRINT_MUTATES;

  const { getPropOfCurrentObject } = useGetters({
    getPropOfCurrentObject: APP_GETTERS.SELECT_PROP_CURRENT_OBJECT
  });

  const {
    setPropertyById,
    setProperty,
    setPropOfMultipleObjects,
    setObjectPropOfSheetFrames
  } = useMutations({
    setPropertyById: MUTATES.SET_PROP_BY_ID,
    setProperty: MUTATES.SET_PROP,
    setPropOfMultipleObjects: MUTATES.SET_PROP_OF_MULIPLE_OBJECTS,
    setObjectPropOfSheetFrames: MUTATES.SET_OBJECT_PROP_OF_SHEET_FRAMES
  });

  const getProperty = prop => {
    return getPropOfCurrentObject.value(prop);
  };

  return {
    getProperty,
    setProperty,
    setPropertyById,
    setPropOfMultipleObjects,
    setObjectPropOfSheetFrames
  };
};
