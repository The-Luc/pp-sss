<template>
  <div class="frames-container">
    <div class="row">
      <div
        v-for="(frame, index) in frameData"
        :key="frame.id"
        class="frame-container"
        @click="onFrameClick(frame.id)"
      >
        <div class="frame-item" :class="{ active: frame.id === activeFrameId }">
          <img
            v-if="frame.image"
            :src="frame.image"
            alt="frame thumbnail"
            class="frame-image"
          />
        </div>
        <div class="frame-name">Frame {{ index + 1 }}</div>
      </div>
      <EmptyFrame @click="addFrame" />
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
