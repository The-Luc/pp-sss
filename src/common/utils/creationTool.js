import { getBoolean, isEmpty } from './util';

import {
  INSTRUCTION_TOOLS,
  NON_ELEMENT_PROPERTIES_TOOLS,
  TOOL_NAME
} from '@/common/constants';

/**
 * Get tool item list
 *
 * @param   {Array} toolGroups  group of tool
 * @returns {Array}             tool items
 */
const getToolItems = (toolGroups, isRightTool = true) => {
  return toolGroups.map(tools => {
    return tools.map(t => {
      return {
        ...t,
        isElementProperties: getBoolean(t.isElementProperties),
        isInstruction: getBoolean(t.isInstruction),
        isUseCustomAction: getBoolean(t.isUseCustomAction),
        isNotHighlight: getBoolean(t.isNotHighlight),
        isNotDiscard: getBoolean(t.isNotDiscard),
        isDiscardObjects: getBoolean(t.isDiscardObjects),
        isRightTool
      };
    });
  });
};

/**
 * Get tool item list
 *
 * @param   {Array} toolGroups  group of tool
 * @returns {Array}             tool items
 */
export const getRightToolItems = toolGroups => {
  return getToolItems(toolGroups);
};

/**
 * Check tool is an instruction tool
 *
 * @param   {String}  toolName  name of tool
 * @returns {Boolean}           is tool an instruction tool
 */
export const isInstructionTool = toolName => {
  return INSTRUCTION_TOOLS.includes(toolName);
};

/**
 * Check is a non-element properties menu selected
 *
 * @param   {String}  propertiesType  properties object type
 * @returns {Boolean}                 is selected
 */
export const isNonElementPropSelected = propertiesType => {
  return NON_ELEMENT_PROPERTIES_TOOLS.includes(propertiesType);
};

/**
 * Check is tool activated
 *
 * @returns {Boolean} is activated
 */
export const isToolActivated = (toolItem, propertiesType, selectedToolName) => {
  if (isEmpty(toolItem)) return false;

  if (toolItem.isRightTool) return toolItem.name === propertiesType;

  return toolItem.name === selectedToolName;
};

/**
 * Get default disabled items
 *
 * @returns {Array} list of disabled items
 */
export const getDefaultDisabledItems = () => {
  return [TOOL_NAME.UNDO, TOOL_NAME.REDO];
};
