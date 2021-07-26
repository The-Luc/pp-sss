export const updateAssigneeApi = (sectionId, userId) => {
  return new Promise(resolve => {
    const index = window.data.sections.findIndex(({ id }) => id === sectionId);

    if (index < 0) {
      resolve();

      return;
    }

    window.data.sections[index].assigneeId = userId;

    resolve();
  });
};

export default {
  updateAssignee: updateAssigneeApi
};
