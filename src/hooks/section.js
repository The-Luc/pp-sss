import { useGetters } from 'vuex-composition-helpers';

import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import { GETTERS as DIGITAL_GETTERS } from '@/store/modules/digital/const';

import bookService from '@/api/book';
import { useAppCommon } from './common';

export const useMutationSection = () => {
  const updateSection = async (bookId, sectionId, body) => {
    const { data, isSuccess } = await bookService.updateSection(
      bookId,
      sectionId,
      body
    );
    return {
      data,
      isSuccess
    };
  };
  return {
    updateSection
  };
};

export const useGetterEditionSection = () => {
  const { value: isDigital } = useAppCommon().isDigitalEdition;
  const GETTERS = isDigital ? DIGITAL_GETTERS : PRINT_GETTERS;

  const { currentSection } = useGetters({
    currentSection: GETTERS.CURRENT_SECTION
  });

  return {
    currentSection
  };
};

export const useGetterPrintSection = () => {
  // adding getter for print edition only here

  return { ...useGetterEditionSection() };
};

export const useGetterDigitalSection = () => {
  // adding getter for digital edition only here

  return { ...useGetterEditionSection() };
};
