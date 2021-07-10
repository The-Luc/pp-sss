<template>
  <div class="digital-frame">
    <div class="row">
      <div
        v-for="(frame, index) in frameData"
        :key="frame.id"
        class="container-digital-frame"
        @click="onFrameClick(frame.id)"
      >
        <div
          class="item-digital-frame"
          :class="{ active: frame.id === activeFrameId }"
        >
          <img
            v-if="frame.image"
            :src="frame.image"
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
