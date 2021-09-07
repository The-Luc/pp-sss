<template>
  <div class="preview-container">
    <FoldersInfo :selected-folders="selectedFolders" />

    <PreviewContainer
      :portraits="portraits"
      :layout="layoutSettings"
      :page-no="pageNo"
      :background-url="backgroundUrl"
      :flow-settings="flowSettings"
      @moveBack="onMoveToPreviousPage"
      @moveNext="onMoveToNextPage"
    />

    <StartPage
      :selected-pages="pages"
      :selected-page="startPage"
      @pageChange="onStartPageChange"
    />

    <PreviewInfo
      :total-portrait="flowSettings.totalPortraitsCount"
      :total-page="requiredPages.length"
      @showPreview="onShowPreview"
    />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
