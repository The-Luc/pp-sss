<template>
  <div class="digital-frame">
    <div class="row">
      <div
        v-for="({ id, frame }, index) in frameData"
        :key="id"
        class="container-digital-frame"
        @click="onFrameClick(id)"
      >
        <div
          class="item-digital-frame"
          :class="{ active: id === activeFrameId }"
        >
          <img
            v-if="frame.previewImageUrl"
            :src="frame.previewImageUrl"
            alt="frame thumbnail"
            class="digital-frame-image"
          />
        </div>
        <div class="name-frame">Frame {{ index + 1 }}</div>
      </div>
      <EmptyFrame @click="addFrame" />
    </div>
  </div>
</template>

<script src="./script.js" />

<style lang="scss" src="./style.scss" scoped />
