<template>
  <div class="preview-container">
    <FoldersInfo :selected-folders="selectedFolders" />

    <PreviewThumbnail :pages="pages" :current-page="currentPage" />

    <StartPage :pages="pages" :current-page="currentPage" />

    <PreviewInfo :total-portrait="75" :total-page="5" />
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scoped />
