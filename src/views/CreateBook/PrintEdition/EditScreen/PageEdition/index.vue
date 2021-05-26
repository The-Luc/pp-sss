<template>
  <div class="page-edition">
    <div
      class="container-edition"
      :class="[
        { 'canvas-soft-cover': isSoftCover },
        { 'canvas-hard-cover': isHardCover },
        { intro: isIntro },
        { signature: isSignature }
      ]"
    >
      <canvas id="page-left"></canvas>
      <canvas id="page-right"></canvas>
      <div class="page-container">
        <div class="page">
          <div class="page-left">
            <div v-if="isIntro" class="front-cover">
              <div>Inside Front Cover</div>
              <div>THIS PAGE</div>
              <div>DOES NOT PRINT</div>
            </div>
          </div>
          <div class="page-right">
            <div v-if="isSignature" class="front-cover">
              <div>Inside Front Cover</div>
              <div>THIS PAGE</div>
              <div>DOES NOT PRINT</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style lang="scss" scoped src="./style.scss" />
