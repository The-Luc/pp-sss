<template>
  <div class="page-indicators" :style="containerStyle">
    <div class="print-inside-cover">
      <div
        class="print-inside-front-cover"
        :style="{
          visibility: isFrontCover ? 'visible' : 'hidden'
        }"
      >
        <div class="print-message-box">
          <p class="print-title">Inside Front Cover</p>
          <p class="print-subtitle">THIS PAGE<br />DOES NOT PRINT</p>
        </div>
      </div>
      <div
        class="print-spines"
        :class="spineConfig.single ? 'single' : 'double'"
        :style="spineConfig.style"
      >
        &nbsp;
      </div>
      <div
        class="print-inside-back-cover"
        :style="{
          visibility: isBackCover ? 'visible' : 'hidden'
        }"
      >
        <div class="print-message-box">
          <p class="print-title">Inside Back Cover</p>
          <p class="print-subtitle">THIS PAGE<br />DOES NOT PRINT</p>
        </div>
      </div>
    </div>
    <div class="print-bleed" :style="bleedStyle">
      <div class="print-inner-bleed">
        <div v-if="!isFrontCover" class="print-left" :style="safeMarginStyle">
          &nbsp;
        </div>
        <div v-if="!isBackCover" class="print-right" :style="safeMarginStyle">
          &nbsp;
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
