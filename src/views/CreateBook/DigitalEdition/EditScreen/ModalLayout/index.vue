<template>
  <div class="layout-modal-container">
    <Layouts
      :edition="edition"
      :initial-data="initialData"
      @close="onClose"
      @addFrame="onAddFrame"
    />
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
