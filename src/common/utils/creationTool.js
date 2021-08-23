import { isEmpty } from '@/common/utils';

import {
  INSTRUCTION_TOOLS,
  NON_ELEMENT_PROPERTIES_TOOLS,
  PROPERTIES_TOOLS,
  ONE_CLICK_TOOLS,
  TOOL_NAME
} from '@/common/constants';

/**
 * Get right tool item list
 *
 * @param   {Object}  rightTool right tool data
 * @returns {Array}             right tool items
 */
export const getRightToolItems = rightTool => {
  return rightTool.map(({ iconName, name, id }) => {
    return { iconName, title: name, name: id };
  });
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
 * Check is tool an element tool
 *
 * @param   {String}  name  name of tool
 * @returns {Boolean}       is tool an element tool
 */
export const isElementTool = ({ name }) => {
  return isEmpty(getNonElementToolType(name));
};

/**
 * Get type of non-element tool
 *
 * @param   {String}  toolName  name of tool
 * @returns {String}            type of tool
 */
export const getNonElementToolType = toolName => {
  const tool = NON_ELEMENT_PROPERTIES_TOOLS.find(({ id }) => toolName === id);

  return tool?.type;
};

/**
 * Check is toggle properties menu
 *
 * @returns {Boolean} is toggle menu
 */
export const isTogglePropertiesMenu = (
  { name: toolName },
  propertiesType,
  isElementProperties
) => {
  if (isElementProperties) {
    return !isNonElementPropSelected(propertiesType);
  }

  const toolType = getNonElementToolType(toolName);

  return isEmpty(propertiesType) || propertiesType === toolType;
};

/**
 * Check is properties menu item activated
 *
 * @param   {String}  toolName        tool name
 * @param   {String}  propertiesType  properties object type
 * @param   {Object}  menuItem        menu item
 * @returns {Boolean}                 is activated
 */
const isPropMenuItemActivated = (toolName, propertiesType, menuItem) => {
  const isSelected = propertiesType === menuItem.type;

  const isCheckItem = toolName === menuItem.id;

  return isSelected && isCheckItem;
};

/**
 * Check is a non-element properties menu selected
 *
 * @param   {String}  propertiesType  properties object type
 * @returns {Boolean}                 is selected
 */
export const isNonElementPropSelected = propertiesType => {
  return NON_ELEMENT_PROPERTIES_TOOLS.some(
    ({ type }) => propertiesType === type
  );
};

/**
 * Check is tool activated
 *
 * @returns {Boolean} is activated
 */
export const isToolActivated = (
  toolName,
  propertiesType,
  isMenuOpen,
  selectedToolName
) => {
  if (isEmpty(toolName)) return false;

  const isNonElementItemActivated = NON_ELEMENT_PROPERTIES_TOOLS.some(item => {
    return isPropMenuItemActivated(toolName, propertiesType, item);
  });

  if (isNonElementItemActivated) return isMenuOpen;

  const isPropertiesSelected =
    !isEmpty(propertiesType) && !isNonElementPropSelected(propertiesType);

  const isPropertiesMenu = PROPERTIES_TOOLS.PROPERTIES.id === toolName;

  const isPropertiesActive = isPropertiesSelected && isPropertiesMenu;

  return isPropertiesActive ? isMenuOpen : toolName === selectedToolName;
};

/**
 * Check tool is an one click tool (click but not selected)
 *
 * @param   {String}  toolName  name of tool
 * @returns {Boolean}           is tool an one click tool
 */
export const isOneClickTool = toolName => {
  return ONE_CLICK_TOOLS.includes(toolName);
};

/**
 * Get default disabled items
 *
 * @returns {Array} list of disabled items
 */
export const getDefaultDisabledItems = () => {
  return [TOOL_NAME.UNDO, TOOL_NAME.REDO];
};
