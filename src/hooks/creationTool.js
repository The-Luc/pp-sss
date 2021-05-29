import { useMutations, useGetters } from 'vuex-composition-helpers';

import { MUTATES, GETTERS } from '@/store/modules/app/const';

/**
 * Trigger mutation to close popover, menu properties from icon creation tool
 * @return {Object} Function to reset print config
 */
export const useResetPrintConfig = () => {
  const { resetPrintConfig } = useMutations({
    resetPrintConfig: MUTATES.RESET_PRINT_CONFIG
  });

  return {
    resetPrintConfig
  };
};

/**
 * Trigger mutation to close popover and getter selected tool name
 *  @return {Object} Function set tool name and selected tool name value
 */
export const usePopoverCreationTool = () => {
  const { mutate } = useMutations({
    mutate: MUTATES.SET_TOOL_NAME_SELECTED
  });

  const { selectedToolName } = useGetters({
    selectedToolName: GETTERS.SELECTED_TOOL_NAME
  });

  const setToolNameSelected = name => {
    mutate({
      name
    });
  };
  return {
    setToolNameSelected,
    selectedToolName
  };
};
