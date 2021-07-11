<template>
  <div class="frames-container">
    <div class="row frame-row">
      <div
        v-for="({ id, frame }, index) in frameData"
        :key="id"
        class="frame-container"
        @click="onFrameClick(id)"
      >
        <div class="frame-item" :class="{ active: id === activeFrameId }">
          <img
            v-if="frame.previewImageUrl"
            :src="frame.previewImageUrl"
            alt="frame thumbnail"
            class="frame-image"
          />
        </div>
        <div class="frame-name">Frame {{ index + 1 }}</div>
      </div>
      <EmptyFrame v-if="showAddFrame" @click="addFrame" />
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
