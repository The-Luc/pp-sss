import { useGetters } from 'vuex-composition-helpers';

import { useAppCommon } from './common';

import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import { GETTERS as DIGITAL_GETTERS } from '@/store/modules/digital/const';
import { updateSection } from '@/api/section';

export const useMutationSection = () => {
  return {
    updateSection
  };
};

export const useGetterEditionSection = () => {
  const { value: isDigital } = useAppCommon().isDigitalEdition;
  const GETTERS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;

  const { currentSection, sections } = useGetters({
    currentSection: GETTERS.CURRENT_SECTION,
    sections: GETTERS.SECTIONS_SHEETS
  });

  return { currentSection, sections };
};

export const useGetterPrintSection = () => {
  // adding getter for print edition only here

  return { ...useGetterEditionSection() };
};

export const useGetterDigitalSection = () => {
  // adding getter for digital edition only here

  return { ...useGetterEditionSection() };
};
