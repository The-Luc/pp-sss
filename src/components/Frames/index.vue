<template>
  <div class="frames-container">
    <FrameMenu
      :is-open="isOpenMenu"
      :menu-x="menuX"
      :menu-y="menuY"
      @onClose="onCloseMenu"
      @onChangeLayout="onChangeLayout"
      @onDeleteFrame="onDeleteFrame"
    />
    <div class="row frame-row">
      <div
        v-for="({ id, frame }, index) in frameData"
        :key="id"
        :ref="`frame-${id}`"
        class="frame-container"
        @click="onFrameClick(id)"
      >
        <div class="frame-item" :class="{ active: id === activeFrameId }">
          <img
            v-if="id === activeFrameId && !isOpenMenu"
            class="frame-item-option"
            src="@/assets/icons/three-dots.svg"
            alt="option button"
            @click="onOptionClick($event, id)"
          />
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
