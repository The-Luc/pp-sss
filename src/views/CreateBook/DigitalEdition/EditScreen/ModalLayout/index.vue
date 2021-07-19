<template>
  <div class="layout-modal-container">
    <Layouts
      :edition="edition"
      :initial-data="initialData"
      @close="onClose"
      @addFrame="onAddFrame"
    />
    <div class="layout-modal-legend" :style="{ right }"></div>
  </div>
</template>

<script src="./script.js" />
<style lang="scss" src="./style.scss" />
