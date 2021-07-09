<template>
  <div class="frames-container">
    <div class="row">
      <div class="frame-container">
        <div class="frame-item active"></div>
        <div class="frame-name">Frame 10</div>
      </div>
      <EmptyFrame @click="addFrame" />
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
