export const saveSelectedPortraitFolders = (folderIds, isDigital) => {
  setTimeout(() => {
    const { digital, print } = window.data.book.selectedPortraitFolders;
    if (isDigital) {
      window.data.book.selectedPortraitFolders.digital = [
        ...new Set(digital.concat(folderIds))
      ];
      return;
    }
    window.data.book.selectedPortraitFolders.print = [
      ...new Set(print.concat(folderIds))
    ];
  });
};
