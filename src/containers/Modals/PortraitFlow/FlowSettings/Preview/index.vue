<template>
  <div class="preview-container">
    <FoldersInfo :selected-folders="selectedFolders" />

    <PreviewContainer
      :portraits="portraits"
      :layout="layoutSettings"
      :page-no="pageNo"
      :background-url="backgroundUrl"
      :flow-settings="flowSettings"
      :is-digital="isDigital"
      :screen-number="screenNumber"
      :container-name="containerName"
      @moveBack="onMoveToPreviousPage"
      @moveNext="onMoveToNextPage"
    />

    <StartPage
      :selected-pages="pages"
      :selected-page="startPage"
      :is-digital="isDigital"
      :container-name="containerName"
      @pageChange="onStartPageChange"
    />

    <PreviewInfo
      :total-portrait="flowSettings.totalPortraitsCount"
      :total-pages="requiredPages.length"
      :container-name="containerName"
      @showPreview="onShowPreview"
    />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
