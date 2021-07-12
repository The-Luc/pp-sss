/**
 * Get right tool item list
 *
 * @param   {Object}  rightTool right tool data
 * @returns {Array}             right tool items
 */
export const getRightToolItems = rightTool => {
  return Object.keys(rightTool).map(k => {
    return {
      iconName: rightTool[k].iconName,
      title: rightTool[k].name,
      name: rightTool[k].value
    };
  });
};
