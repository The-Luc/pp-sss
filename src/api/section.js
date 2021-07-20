export const updateAssigneeApi = (sectionId, userId) => {
  return new Promise(resolve => {
    window.data.sections[sectionId].assigneeId = userId;

    resolve();
  });
};

export default {
  updateAssignee: updateAssigneeApi
};
